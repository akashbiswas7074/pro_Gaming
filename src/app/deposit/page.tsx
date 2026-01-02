'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Wallet,
    ArrowRight,
    Copy,
    CheckCircle,
    AlertTriangle,
    Clock,
    Coins,
    Shield,
    Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';
import { GAME_CONFIG } from '@/types';

export default function DepositPage() {
    const router = useRouter();
    const { user, balances, activateBasic, wallet } = useUserStore();
    const [amount, setAmount] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    if (!user) return null;

    const handleDeposit = async () => {
        setIsProcessing(true);

        // Simulate deposit process
        await new Promise(resolve => setTimeout(resolve, 2000));

        activateBasic(amount);
        setSuccess(true);
        setIsProcessing(false);
    };

    const presetAmounts = [10, 25, 50, 100, 250, 500, 1000];

    return (
        <DashboardLayout>
            <div className="container py-8 max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="page-header text-center">
                    <h1 className="page-title flex items-center justify-center gap-3">
                        <Wallet className="w-8 h-8 text-[var(--primary)]" />
                        Deposit USDT
                    </h1>
                    <p className="page-subtitle">
                        Fund your account to start playing and earning.
                    </p>
                </div>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card text-center"
                    >
                        <div className="mb-6">
                            <div className="w-20 h-20 rounded-full bg-[var(--success)]/20 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Deposit Successful!</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            ${amount.toFixed(2)} USDT has been added to your account.
                        </p>
                        {user.status === 'basic' && (
                            <div className="p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30 mb-6">
                                <Zap className="w-5 h-5 text-[var(--success)] inline mr-2" />
                                Your Basic Game is now activated! Your frozen balance has been unlocked.
                            </div>
                        )}
                        <div className="flex gap-4 justify-center">
                            <Link href="/game" className="btn btn-primary">
                                Start Playing
                            </Link>
                            <Link href="/dashboard" className="btn btn-secondary">
                                Go to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Activation Info */}
                        {user.status === 'free' && (
                            <div className="card bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border-[var(--primary)]/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-1">Activate Your Account</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Deposit {GAME_CONFIG.basicActivationAmount}+ USDT to activate your account,
                                            unlock your frozen balance of <span className="font-bold text-[var(--accent)]">
                                                ${balances.frozen.toFixed(2)} USDT
                                            </span>, and secure your ID for lifetime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Deposit Card */}
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">Select Amount</h2>

                            {/* Preset Amounts */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {presetAmounts.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setAmount(preset)}
                                        className={`py-3 rounded-lg font-medium transition-all ${amount === preset
                                                ? 'bg-[var(--primary)] text-white'
                                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                                            }`}
                                    >
                                        ${preset}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Input */}
                            <div className="input-group mb-6">
                                <label className="input-label">Custom Amount (USDT)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                                    min={1}
                                    max={10000}
                                    className="input text-2xl font-bold text-center"
                                />
                            </div>

                            {/* Payment Info */}
                            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] mb-6">
                                <h3 className="font-medium mb-3">Send USDT (BEP20) to:</h3>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                                    <code className="text-sm flex-1 truncate text-[var(--primary-light)]">
                                        0x742d35Cc6634C0532925a3b844Bc9e7595f8c2Ed
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b844Bc9e7595f8c2Ed')}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-2">
                                    Only send USDT on BEP20 network. Other tokens will be lost.
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Deposit Amount</span>
                                    <span className="font-bold">${amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Network Fee</span>
                                    <span className="text-[var(--success)]">Free</span>
                                </div>
                                {user.status === 'free' && amount >= GAME_CONFIG.basicActivationAmount && (
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Frozen Balance Unlock</span>
                                        <span className="font-bold text-[var(--accent)]">
                                            +${balances.frozen.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-[var(--border-color)] flex justify-between">
                                    <span className="font-bold">Total Credit</span>
                                    <span className="font-bold gradient-gold-text text-xl">
                                        ${(amount + (user.status === 'free' ? balances.frozen : 0)).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Deposit Button */}
                            <button
                                onClick={handleDeposit}
                                disabled={isProcessing}
                                className="btn btn-primary btn-lg w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing Deposit...
                                    </>
                                ) : (
                                    <>
                                        Deposit ${amount.toFixed(2)}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security Notice */}
                        <div className="card">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium mb-1">Secure & Transparent</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        All deposits are processed via smart contract on the BEP20 network.
                                        Transactions are 100% transparent and verifiable on the blockchain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
