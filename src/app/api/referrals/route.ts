import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Referral, Balance } from '@/lib/models';

// GET - Get referral tree and commissions
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

        // Get all referrals for this user
        const referrals = await Referral.find({ referrerId: user._id })
            .populate('referredId', 'walletAddress status totalVolume registeredAt');

        // Group by level
        const level1 = referrals.filter(r => r.level === 1);
        const level2 = referrals.filter(r => r.level === 2);
        const level3to10 = referrals.filter(r => r.level >= 3 && r.level <= 10);

        // Calculate commissions by level
        const levelCommissions = {
            level1: level1.reduce((sum, r) => sum + r.commission, 0),
            level2: level2.reduce((sum, r) => sum + r.commission, 0),
            level3to10: level3to10.reduce((sum, r) => sum + r.commission, 0),
        };

        // Calculate total
        const totalCommissions = levelCommissions.level1 + levelCommissions.level2 + levelCommissions.level3to10;

        // Get qualified referrals (min $100 volume) for cashback tier
        const qualifiedReferrals = level1.filter(r => {
            const referred = r.referredId as any;
            return referred && referred.totalVolume >= 100;
        }).length;

        return NextResponse.json({
            referralCode: user.referralCode,
            directReferrals: user.directReferrals,
            totalReferrals: referrals.length,
            qualifiedReferrals,
            levels: {
                level1: level1.map(r => ({
                    id: r._id,
                    userId: (r.referredId as any)?._id,
                    walletAddress: (r.referredId as any)?.walletAddress,
                    status: (r.referredId as any)?.status || r.status,
                    volume: (r.referredId as any)?.totalVolume || 0,
                    commission: r.commission,
                    registeredAt: (r.referredId as any)?.registeredAt || r.createdAt,
                })),
                level2: level2.map(r => ({
                    id: r._id,
                    status: r.status,
                    commission: r.commission,
                    createdAt: r.createdAt,
                })),
                level3to10Count: level3to10.length,
            },
            commissions: {
                level1: levelCommissions.level1,
                level2: levelCommissions.level2,
                level3to10: levelCommissions.level3to10,
                total: totalCommissions,
            },
            // Frozen referral limit info
            frozenReferralLimit: 10,
            frozenReferralsUsed: Math.min(user.directReferrals, 10),
        });

    } catch (error: any) {
        console.error('Get referrals error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get referrals' },
            { status: 500 }
        );
    }
}

// POST - Claim referral commission (for Pro users)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { walletAddress } = body;

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

        if (user.status !== 'pro') {
            return NextResponse.json(
                { error: 'Pro status required to claim commissions' },
                { status: 403 }
            );
        }

        // Get unclaimed referral commissions
        const referrals = await Referral.find({
            referrerId: user._id,
            status: { $in: ['activated', 'pro'] },
            commission: { $gt: 0 }
        });

        const totalCommission = referrals.reduce((sum, r) => sum + r.commission, 0);

        if (totalCommission <= 0) {
            return NextResponse.json(
                { error: 'No commissions available to claim' },
                { status: 400 }
            );
        }

        // Add commissions to cash balance
        await Balance.findOneAndUpdate(
            { userId: user._id },
            { $inc: { cash: totalCommission } }
        );

        // Reset claimed commissions
        await Referral.updateMany(
            { referrerId: user._id },
            { $set: { commission: 0 } }
        );

        const updatedBalance = await Balance.findOne({ userId: user._id });

        return NextResponse.json({
            success: true,
            claimed: totalCommission,
            balance: {
                frozen: updatedBalance?.frozen || 0,
                basic: updatedBalance?.basic || 0,
                pro: updatedBalance?.pro || 0,
                cash: updatedBalance?.cash || 0,
            }
        });

    } catch (error: any) {
        console.error('Claim referral error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to claim commissions' },
            { status: 500 }
        );
    }
}
