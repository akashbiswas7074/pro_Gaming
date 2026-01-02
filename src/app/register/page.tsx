'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Wallet,
    Gift,
    AlertTriangle,
    CheckCircle,
    Copy,
    ArrowRight,
    Shield,
    Lock,
    Info,
    Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';

export default function RegisterPage() {
    const router = useRouter();
    const { register, user } = useUserStore();

    const [walletAddress, setWalletAddress] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Validate wallet address (simple BEP20/Ethereum format)
    const isValidAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handleConnect = async () => {
        // Simulate wallet connection (in real app, use ethers.js/wagmi)
        if (typeof window !== 'undefined' && (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum) {
            try {
                const ethereum = (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts[0]) {
                    setWalletAddress(accounts[0]);
                }
            } catch (err) {
                console.error('Wallet connection failed:', err);
                // For demo, generate a random address
                const randomAddress = '0x' + Array.from({ length: 40 }, () =>
                    Math.floor(Math.random() * 16).toString(16)
                ).join('');
                setWalletAddress(randomAddress);
            }
        } else {
            // For demo purposes, generate a random address
            const randomAddress = '0x' + Array.from({ length: 40 }, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('');
            setWalletAddress(randomAddress);
        }
    };

    const handleRegister = async () => {
        if (!isValidAddress(walletAddress)) {
            setError('Please enter a valid BEP20 wallet address');
            return;
        }
        if (!agreed) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate registration delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            register(walletAddress, referralCode || undefined);
            router.push('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // If already registered, redirect
    if (user) {
        router.push('/dashboard');
        return null;
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center py-20 px-4">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#8b5cf6]/10 via-transparent to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg relative z-10"
                >
                    {/* Bonus Banner */}
                    <div className="glass-card p-4 mb-6 flex items-center gap-4 glow-gold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] flex items-center justify-center flex-shrink-0">
                            <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-[var(--accent)]">Free Sign-Up Bonus</div>
                            <div className="text-sm text-[var(--text-secondary)]">
                                Get <span className="font-bold text-white">10 USDT</span> credited instantly upon registration
                            </div>
                        </div>
                    </div>

                    {/* Registration Card */}
                    <div className="glass-card p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gradient-primary)] mb-4" style={{ background: 'var(--gradient-primary)' }}>
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                            <p className="text-[var(--text-secondary)]">
                                Connect your wallet to start playing and earning
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Wallet Input */}
                            <div className="input-group">
                                <label className="input-label flex items-center gap-2">
                                    <Wallet className="w-4 h-4" />
                                    BEP20 Wallet Address
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                        placeholder="0x..."
                                        className="input flex-1 font-mono text-sm"
                                    />
                                    <button
                                        onClick={handleConnect}
                                        className="btn btn-secondary"
                                        title="Connect Wallet"
                                    >
                                        <Wallet className="w-4 h-4" />
                                    </button>
                                </div>
                                {walletAddress && !isValidAddress(walletAddress) && (
                                    <p className="text-xs text-[var(--danger)] mt-1 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Invalid wallet address format
                                    </p>
                                )}
                            </div>

                            {/* Referral Code */}
                            <div className="input-group">
                                <label className="input-label flex items-center gap-2">
                                    <Gift className="w-4 h-4" />
                                    Referral Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    placeholder="Enter referral code"
                                    className="input uppercase"
                                />
                            </div>

                            {/* Warning Box */}
                            <div className="p-4 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/30">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-[var(--danger)] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-[var(--danger)] text-sm mb-1">
                                            Irreversible Wallet Linking
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Your wallet address cannot be changed after registration.
                                            All withdrawals will be sent to this address permanently.
                                            Use a personal wallet (MetaMask, Trust Wallet), not an exchange.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
                                />
                                <span className="text-sm text-[var(--text-secondary)]">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-[var(--primary-light)] hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-[var(--primary-light)] hover:underline">
                                        Privacy Policy
                                    </a>
                                    . I understand that the wallet address I provide is permanent.
                                </span>
                            </label>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-sm text-[var(--danger)] flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Register Button */}
                            <button
                                onClick={handleRegister}
                                disabled={isLoading || !walletAddress || !agreed}
                                className="btn btn-primary btn-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
                            <div className="text-sm font-medium mb-3">What you&apos;ll get:</div>
                            <div className="space-y-2">
                                {[
                                    '10 USDT sign-up bonus (Frozen Balance)',
                                    'Unique referral code to earn commissions',
                                    'Access to Basic Game after 10 USDT deposit',
                                    'Lifetime account (after activation)',
                                ].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Already have account */}
                    <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                        Already have an account?{' '}
                        <button onClick={handleConnect} className="text-[var(--primary-light)] hover:underline">
                            Connect your wallet
                        </button>
                    </p>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
