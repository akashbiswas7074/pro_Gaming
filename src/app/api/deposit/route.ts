import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Balance, Transaction } from '@/lib/models';

// POST - Make a deposit
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { walletAddress, amount, txHash } = body;

        // Validate input
        if (!walletAddress || !amount) {
            return NextResponse.json(
                { error: 'Wallet address and amount are required' },
                { status: 400 }
            );
        }

        if (amount < 1) {
            return NextResponse.json(
                { error: 'Minimum deposit is 1 USDT' },
                { status: 400 }
            );
        }

        // Get user
        const user = await User.findOne({
            walletAddress: walletAddress.toLowerCase()
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const balance = await Balance.findOne({ userId: user._id });
        if (!balance) {
            return NextResponse.json(
                { error: 'Balance not found' },
                { status: 404 }
            );
        }

        let activationType: string | null = null;
        let frozenUnlocked = 0;

        // Handle activation based on status
        if (user.status === 'free') {
            // First deposit: Basic activation
            if (amount >= 10) {
                activationType = 'basic';
                frozenUnlocked = balance.frozen;

                // Activate basic: unlock frozen balance + deposit goes to basic
                await Balance.findByIdAndUpdate(balance._id, {
                    $set: { frozen: 0 },
                    $inc: { basic: amount + balance.frozen }
                });

                await User.findByIdAndUpdate(user._id, {
                    status: 'basic',
                    activatedAt: new Date(),
                    totalDeposits: amount,
                    $unset: { expiresAt: 1 }
                });

                await Transaction.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    type: 'deposit',
                    amount: amount + balance.frozen,
                    toBalance: 'basic',
                    txHash,
                    status: 'completed',
                    description: `Basic activation: ${amount} USDT + ${balance.frozen} USDT unlocked`,
                });
            } else {
                return NextResponse.json(
                    { error: 'Minimum 10 USDT required for Basic activation' },
                    { status: 400 }
                );
            }

        } else if (user.status === 'basic') {
            // Check if this deposit qualifies for Pro
            const newTotalDeposits = user.totalDeposits + amount;

            if (newTotalDeposits >= 100) {
                activationType = 'pro';

                // Activate Pro: move basic balance to pro + deposit goes to pro
                await Balance.findByIdAndUpdate(balance._id, {
                    $inc: { pro: amount + balance.basic },
                    $set: { basic: 0 }
                });

                await User.findByIdAndUpdate(user._id, {
                    status: 'pro',
                    proActivatedAt: new Date(),
                    $inc: { totalDeposits: amount, totalVolume: amount }
                });

                await Transaction.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    type: 'deposit',
                    amount: amount + balance.basic,
                    toBalance: 'pro',
                    txHash,
                    status: 'completed',
                    description: `Pro activation: ${amount} USDT + ${balance.basic} USDT converted`,
                });
            } else {
                // Regular deposit to basic
                await Balance.findByIdAndUpdate(balance._id, {
                    $inc: { basic: amount }
                });

                await User.findByIdAndUpdate(user._id, {
                    $inc: { totalDeposits: amount }
                });

                await Transaction.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    type: 'deposit',
                    amount,
                    toBalance: 'basic',
                    txHash,
                    status: 'completed',
                    description: `Deposit to basic: ${amount} USDT`,
                });
            }

        } else {
            // Pro user: deposit goes to pro
            await Balance.findByIdAndUpdate(balance._id, {
                $inc: { pro: amount }
            });

            await User.findByIdAndUpdate(user._id, {
                $inc: { totalDeposits: amount, totalVolume: amount }
            });

            await Transaction.create({
                userId: user._id,
                walletAddress: walletAddress.toLowerCase(),
                type: 'deposit',
                amount,
                toBalance: 'pro',
                txHash,
                status: 'completed',
                description: `Deposit to pro: ${amount} USDT`,
            });
        }

        // Refresh user and balance
        const updatedUser = await User.findById(user._id);
        const updatedBalance = await Balance.findOne({ userId: user._id });

        return NextResponse.json({
            success: true,
            activationType,
            frozenUnlocked,
            user: {
                status: updatedUser?.status,
                totalDeposits: updatedUser?.totalDeposits,
                totalVolume: updatedUser?.totalVolume,
            },
            balance: {
                frozen: updatedBalance?.frozen || 0,
                basic: updatedBalance?.basic || 0,
                pro: updatedBalance?.pro || 0,
                cash: updatedBalance?.cash || 0,
            }
        });

    } catch (error: any) {
        console.error('Deposit error:', error);
        return NextResponse.json(
            { error: error.message || 'Deposit failed' },
            { status: 500 }
        );
    }
}

// GET - Get transaction history
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('wallet');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const query: any = { walletAddress: walletAddress.toLowerCase() };
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        // Calculate totals
        const deposits = transactions.filter(t => t.type === 'deposit');
        const withdrawals = transactions.filter(t => t.type === 'withdrawal');
        const gameWins = transactions.filter(t => t.type === 'game_win');

        return NextResponse.json({
            transactions: transactions.map(t => ({
                id: t._id,
                type: t.type,
                amount: t.amount,
                fromBalance: t.fromBalance,
                toBalance: t.toBalance,
                txHash: t.txHash,
                status: t.status,
                description: t.description,
                createdAt: t.createdAt,
            })),
            summary: {
                totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
                totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
                totalWinnings: gameWins.reduce((sum, t) => sum + t.amount, 0),
            }
        });

    } catch (error: any) {
        console.error('Get transactions error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get transactions' },
            { status: 500 }
        );
    }
}
