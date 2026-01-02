import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Balance, Referral } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';

// POST - Register new user
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { walletAddress, referralCode } = body;

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            walletAddress: walletAddress.toLowerCase()
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already registered with this wallet' },
                { status: 409 }
            );
        }

        // Find referrer if code provided
        let referrer = null;
        if (referralCode) {
            referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
            if (!referrer) {
                return NextResponse.json(
                    { error: 'Invalid referral code' },
                    { status: 400 }
                );
            }
        }

        // Generate unique referral code
        const newReferralCode = uuidv4().slice(0, 8).toUpperCase();

        // Create new user
        const user = new User({
            walletAddress: walletAddress.toLowerCase(),
            referralCode: newReferralCode,
            referredBy: referrer?.walletAddress,
        });

        await user.save();

        // Create balance record with 10 USDT frozen bonus
        const balance = new Balance({
            userId: user._id,
            walletAddress: walletAddress.toLowerCase(),
            frozen: 10, // Sign-up bonus
        });

        await balance.save();

        // If referrer exists, create referral records for 10 levels
        if (referrer) {
            // Update referrer's direct referral count
            await User.findByIdAndUpdate(referrer._id, {
                $inc: { directReferrals: 1 }
            });

            // Create level 1 referral
            await Referral.create({
                referrerId: referrer._id,
                referredId: user._id,
                level: 1,
            });

            // Calculate and credit frozen referral commission
            const frozenCommission = 10 * 0.10; // 10% of 10 USDT
            await Balance.findOneAndUpdate(
                { userId: referrer._id },
                { $inc: { frozen: frozenCommission } }
            );

            // Find upline for levels 2-10
            let currentReferrer = referrer;
            for (let level = 2; level <= 10; level++) {
                if (!currentReferrer.referredBy) break;

                const uplineUser = await User.findOne({
                    walletAddress: currentReferrer.referredBy
                });

                if (!uplineUser) break;

                await Referral.create({
                    referrerId: uplineUser._id,
                    referredId: user._id,
                    level,
                });

                // Calculate frozen commission based on level
                const rate = level === 2 ? 0.02 : 0.01;
                const commission = 10 * rate;
                await Balance.findOneAndUpdate(
                    { userId: uplineUser._id },
                    { $inc: { frozen: commission } }
                );

                currentReferrer = uplineUser;
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                referralCode: user.referralCode,
                status: user.status,
            },
            balance: {
                frozen: balance.frozen,
                basic: balance.basic,
                pro: balance.pro,
                cash: balance.cash,
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}

// GET - Get user by wallet address
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

        const balance = await Balance.findOne({ userId: user._id });
        const referrals = await Referral.find({ referrerId: user._id });

        return NextResponse.json({
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                referralCode: user.referralCode,
                status: user.status,
                totalVolume: user.totalVolume,
                directReferrals: user.directReferrals,
                registeredAt: user.registeredAt,
                activatedAt: user.activatedAt,
                isActive: user.isActive,
            },
            balance: balance ? {
                frozen: balance.frozen,
                basic: balance.basic,
                pro: balance.pro,
                cash: balance.cash,
            } : null,
            referralCount: referrals.length,
        });

    } catch (error: any) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get user' },
            { status: 500 }
        );
    }
}
