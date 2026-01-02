import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Balance, GameSession, Transaction, PayoutSchedule } from '@/lib/models';
import {
    generateWinningNumber,
    calculateGameResult,
    calculateDailyPayout
} from '@/lib/blockchain-service';

// POST - Play a game
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { walletAddress, gameType, selectedNumber, entryAmount } = body;

        // Validate input
        if (!walletAddress || !gameType || !selectedNumber || !entryAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (selectedNumber < 1 || selectedNumber > 10) {
            return NextResponse.json(
                { error: 'Selected number must be between 1 and 10' },
                { status: 400 }
            );
        }

        if (entryAmount < 1 || entryAmount > 1000) {
            return NextResponse.json(
                { error: 'Entry amount must be between 1 and 1000 USDT' },
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

        // Check if user is eligible for game type
        if (gameType === 'pro' && user.status !== 'pro') {
            return NextResponse.json(
                { error: 'Pro game requires Pro status. Upgrade first.' },
                { status: 403 }
            );
        }

        if (gameType === 'basic' && user.status === 'free') {
            return NextResponse.json(
                { error: 'Basic game requires Basic activation. Deposit first.' },
                { status: 403 }
            );
        }

        // Get balance
        const balance = await Balance.findOne({ userId: user._id });
        if (!balance) {
            return NextResponse.json(
                { error: 'Balance not found' },
                { status: 404 }
            );
        }

        // Check available balance
        const availableBalance = gameType === 'basic' ? balance.basic : balance.pro;
        if (availableBalance < entryAmount) {
            return NextResponse.json(
                { error: 'Insufficient balance' },
                { status: 400 }
            );
        }

        // Generate winning number and calculate result
        const winningNumber = generateWinningNumber();
        const { win, payout } = calculateGameResult(selectedNumber, winningNumber, entryAmount, 8);

        // Deduct entry amount
        const balanceField = gameType === 'basic' ? 'basic' : 'pro';
        await Balance.findByIdAndUpdate(balance._id, {
            $inc: { [balanceField]: -entryAmount }
        });

        // Create game session record
        const gameSession = new GameSession({
            userId: user._id,
            walletAddress: walletAddress.toLowerCase(),
            gameType,
            entryAmount,
            selectedNumber,
            winningNumber,
            result: win ? 'win' : 'loss',
            payout,
        });

        await gameSession.save();

        // Record transaction for game entry
        await Transaction.create({
            userId: user._id,
            walletAddress: walletAddress.toLowerCase(),
            type: 'game_entry',
            amount: entryAmount,
            fromBalance: balanceField,
            status: 'completed',
            description: `Game entry: selected ${selectedNumber}, bet ${entryAmount} USDT`,
        });

        // If won
        if (win) {
            if (gameType === 'basic') {
                // Basic game: winnings go to basic balance (locked)
                await Balance.findByIdAndUpdate(balance._id, {
                    $inc: { basic: payout }
                });

                await Transaction.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    type: 'game_win',
                    amount: payout,
                    toBalance: 'basic',
                    status: 'completed',
                    description: `Won 8X: ${payout} USDT (locked in basic)`,
                });

            } else {
                // Pro game: create 10-day payout schedule
                const dailyAmount = calculateDailyPayout(payout);
                const now = new Date();

                await PayoutSchedule.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    gameSessionId: gameSession._id,
                    totalAmount: payout,
                    dailyAmount,
                    nextPayoutDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                });

                await Transaction.create({
                    userId: user._id,
                    walletAddress: walletAddress.toLowerCase(),
                    type: 'game_win',
                    amount: payout,
                    status: 'pending',
                    description: `Won 8X: ${payout} USDT (10-day distribution scheduled)`,
                });
            }
        } else {
            // If lost in Pro game, track for cashback
            if (gameType === 'pro') {
                // Update user's total volume (losses count toward volume)
                await User.findByIdAndUpdate(user._id, {
                    $inc: { totalVolume: entryAmount }
                });
            }
        }

        // Refresh balance
        const updatedBalance = await Balance.findOne({ userId: user._id });

        return NextResponse.json({
            success: true,
            result: {
                selectedNumber,
                winningNumber,
                win,
                payout: win ? payout : 0,
                gameType,
                entryAmount,
            },
            balance: {
                frozen: updatedBalance?.frozen || 0,
                basic: updatedBalance?.basic || 0,
                pro: updatedBalance?.pro || 0,
                cash: updatedBalance?.cash || 0,
            }
        });

    } catch (error: any) {
        console.error('Game error:', error);
        return NextResponse.json(
            { error: error.message || 'Game failed' },
            { status: 500 }
        );
    }
}

// GET - Get game history
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('wallet');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const games = await GameSession.find({
            walletAddress: walletAddress.toLowerCase()
        })
            .sort({ playedAt: -1 })
            .limit(limit);

        // Calculate stats
        const totalGames = games.length;
        const wins = games.filter(g => g.result === 'win').length;
        const losses = games.filter(g => g.result === 'loss').length;
        const totalWon = games.filter(g => g.result === 'win').reduce((sum, g) => sum + g.payout, 0);
        const totalLost = games.filter(g => g.result === 'loss').reduce((sum, g) => sum + g.entryAmount, 0);

        return NextResponse.json({
            games: games.map(g => ({
                id: g._id,
                gameType: g.gameType,
                entryAmount: g.entryAmount,
                selectedNumber: g.selectedNumber,
                winningNumber: g.winningNumber,
                result: g.result,
                payout: g.payout,
                playedAt: g.playedAt,
            })),
            stats: {
                totalGames,
                wins,
                losses,
                winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0,
                totalWon,
                totalLost,
                netProfit: totalWon - totalLost,
            }
        });

    } catch (error: any) {
        console.error('Get games error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get games' },
            { status: 500 }
        );
    }
}
