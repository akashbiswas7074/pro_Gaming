import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Balance, PayoutSchedule, Transaction, CashbackStatus } from '@/lib/models';
import { getCashbackRate } from '@/lib/blockchain-service';

// GET - Get active payouts for user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('wallet');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            walletAddress: walletAddress.toLowerCase()
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get active payout schedules
        const payouts = await PayoutSchedule.find({
            userId: user._id,
            status: 'active'
        }).sort({ nextPayoutDate: 1 });

        // Get cashback status
        const cashbackStatus = await CashbackStatus.findOne({ userId: user._id });

        // Calculate totals
        const totalPending = payouts.reduce((sum, p) => {
            const remaining = (p.totalDays - p.paidDays) * p.dailyAmount;
            return sum + remaining;
        }, 0);

        return NextResponse.json({
            payouts: payouts.map(p => ({
                id: p._id,
                totalAmount: p.totalAmount,
                dailyAmount: p.dailyAmount,
                paidDays: p.paidDays,
                totalDays: p.totalDays,
                remainingAmount: (p.totalDays - p.paidDays) * p.dailyAmount,
                nextPayoutDate: p.nextPayoutDate,
                status: p.status,
                createdAt: p.createdAt,
            })),
            totalPending,
            cashback: cashbackStatus ? {
                totalLosses: cashbackStatus.totalLosses,
                totalRecovered: cashbackStatus.totalRecovered,
                dailyRate: cashbackStatus.dailyRate,
                maxRecovery: cashbackStatus.maxRecovery,
                isActive: cashbackStatus.isActive,
                qualifiedReferrals: cashbackStatus.qualifiedReferrals,
                remainingRecovery: Math.max(0,
                    (cashbackStatus.totalLosses * cashbackStatus.maxRecovery / 100) - cashbackStatus.totalRecovered
                ),
            } : null,
        });

    } catch (error: any) {
        console.error('Get payouts error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get payouts' },
            { status: 500 }
        );
    }
}

// POST - Process daily payouts (called by cron job or admin)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const adminKey = searchParams.get('adminKey');

        // Simple admin key check (in production, use proper auth)
        if (adminKey !== process.env.ADMIN_API_KEY) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const now = new Date();

        // Find all active payouts due today
        const duePayouts = await PayoutSchedule.find({
            status: 'active',
            nextPayoutDate: { $lte: now }
        });

        const results: any[] = [];

        for (const payout of duePayouts) {
            // Credit daily amount to cash balance
            await Balance.findOneAndUpdate(
                { userId: payout.userId },
                { $inc: { cash: payout.dailyAmount } }
            );

            // Update payout schedule
            payout.paidDays += 1;

            if (payout.paidDays >= payout.totalDays) {
                payout.status = 'completed';
            } else {
                payout.nextPayoutDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            }

            await payout.save();

            // Record transaction
            await Transaction.create({
                userId: payout.userId,
                walletAddress: payout.walletAddress,
                type: 'game_win',
                amount: payout.dailyAmount,
                toBalance: 'cash',
                status: 'completed',
                description: `Daily payout ${payout.paidDays}/${payout.totalDays}: ${payout.dailyAmount} USDT`,
            });

            results.push({
                userId: payout.userId,
                amount: payout.dailyAmount,
                day: payout.paidDays,
                status: payout.status,
            });
        }

        // Process cashback payouts
        const activeCashbacks = await CashbackStatus.find({ isActive: true });
        const cashbackResults: any[] = [];

        for (const cashback of activeCashbacks) {
            const user = await User.findById(cashback.userId);
            if (!user || user.status !== 'pro') continue;

            // Get qualified referrals count
            const qualifiedReferrals = cashback.qualifiedReferrals;
            const { rate, maxROI } = getCashbackRate(qualifiedReferrals);

            // Calculate daily cashback
            const maxRecovery = cashback.totalLosses * maxROI;
            const remainingRecovery = maxRecovery - cashback.totalRecovered;

            if (remainingRecovery <= 0) {
                cashback.isActive = false;
                await cashback.save();
                continue;
            }

            const dailyCashback = Math.min(
                cashback.totalLosses * rate,
                remainingRecovery
            );

            // Credit cashback to cash balance
            await Balance.findOneAndUpdate(
                { userId: cashback.userId },
                { $inc: { cash: dailyCashback } }
            );

            // Update cashback status
            cashback.totalRecovered += dailyCashback;
            cashback.lastPayoutDate = now;

            if (cashback.totalRecovered >= maxRecovery) {
                cashback.isActive = false;
            }

            await cashback.save();

            // Record transaction
            await Transaction.create({
                userId: cashback.userId,
                walletAddress: cashback.walletAddress,
                type: 'cashback',
                amount: dailyCashback,
                toBalance: 'cash',
                status: 'completed',
                description: `Daily cashback (${(rate * 100).toFixed(1)}%): ${dailyCashback.toFixed(2)} USDT`,
            });

            cashbackResults.push({
                userId: cashback.userId,
                amount: dailyCashback,
                rate,
                recovered: cashback.totalRecovered,
                maxRecovery,
            });
        }

        return NextResponse.json({
            success: true,
            processedPayouts: results.length,
            payoutResults: results,
            processedCashbacks: cashbackResults.length,
            cashbackResults,
        });

    } catch (error: any) {
        console.error('Process payouts error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process payouts' },
            { status: 500 }
        );
    }
}
