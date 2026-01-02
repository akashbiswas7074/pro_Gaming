import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ethers } from 'ethers';
import dbConnect from '@/lib/mongodb';
import { User, Balance } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            id: 'web3',
            name: 'Web3 Wallet',
            credentials: {
                address: { label: 'Wallet Address', type: 'text' },
                message: { label: 'Message', type: 'text' },
                signature: { label: 'Signature', type: 'text' },
                referralCode: { label: 'Referral Code', type: 'text' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.address || !credentials?.message || !credentials?.signature) {
                        throw new Error('Missing credentials');
                    }

                    const address = credentials.address as string;
                    const message = credentials.message as string;
                    const signature = credentials.signature as string;

                    // Verify the signature
                    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

                    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                        throw new Error('Signature verification failed');
                    }

                    // Connect to database
                    await dbConnect();

                    // Find or create user
                    let user = await User.findOne({
                        walletAddress: address.toLowerCase()
                    });

                    if (!user) {
                        // Create new user
                        const referralCode = uuidv4().slice(0, 8).toUpperCase();

                        user = new User({
                            walletAddress: address.toLowerCase(),
                            referralCode,
                            referredBy: credentials.referralCode || undefined,
                        });

                        await user.save();

                        // Create balance with signup bonus
                        await Balance.create({
                            userId: user._id,
                            walletAddress: address.toLowerCase(),
                            frozen: 10, // 10 USDT signup bonus
                        });
                    }

                    return {
                        id: user._id.toString(),
                        name: user.referralCode,
                        email: address.toLowerCase(),
                        image: null,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.walletAddress = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).userId = token.userId;
                (session.user as any).walletAddress = token.walletAddress;
            }
            return session;
        },
    },
    pages: {
        signIn: '/register',
        error: '/register',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
});

// Export handlers for API route
export const { GET, POST } = handlers;
