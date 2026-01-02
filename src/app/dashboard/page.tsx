'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Wallet,
    Gamepad2,
    Users,
    TrendingUp,
    Copy,
    ArrowUpRight,
    Clock,
    Shield,
    Zap,
    AlertTriangle,
    CheckCircle,
    Gift,
    Lock,
    Unlock,
    Coins,
    Trophy,
    Star
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/types';

export default function DashboardPage() {
    const router = useRouter();
    const { user, balances, wallet, referralTree, ranks, cashbackStatus } = useUserStore();
    const { gameHistory, transactions, activePayout } = useGameStore();

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    if (!user) return null;

    const totalBalance = balances.frozen + balances.basic + balances.pro + balances.cash;
    const availableBalance = balances.cash + balances.pro;
    const daysUntilExpiry = user.status === 'free'
        ? Math.max(0, GAME_CONFIG.freeIDExpiryDays - Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
        : null;

    const copyReferralCode = () => {
        navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referralCode}`);
    };

    const currentRank = ranks.filter(r => r.achieved).length;
    const nextRank = ranks.find(r => !r.achieved);

    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="page-header">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="page-title">Welcome back!</h1>
                            <p className="page-subtitle">
                                Here&apos;s what&apos;s happening with your Pro Game account.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="wallet-address">
                                <Wallet className="w-4 h-4 text-[var(--primary)]" />
                                <span>{wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}</span>
                                <button onClick={() => navigator.clipboard.writeText(wallet?.address || '')} className="hover:text-[var(--primary)]">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {user.status === 'free' && daysUntilExpiry !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 flex items-start gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-[var(--warning)]">
                                Activate Your Account ({daysUntilExpiry} days remaining)
                            </div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Deposit 10+ USDT to activate your account and unlock your frozen balance.
                                Free accounts are deleted after {GAME_CONFIG.freeIDExpiryDays} days.
                            </p>
                            <Link href="/deposit" className="inline-flex items-center gap-1 text-sm text-[var(--warning)] hover:underline mt-2">
                                Deposit Now <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Balance Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="balance-card frozen"
                    >
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                            <Lock className="w-4 h-4" />
                            Frozen Balance
                        </div>
                        <div className="text-2xl font-bold">${balances.frozen.toFixed(2)}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            {user.status === 'free' ? 'Activate to unlock' : 'Transferred'}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="balance-card basic"
                    >
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                            <Gamepad2 className="w-4 h-4" />
                            Basic Game Balance
                        </div>
                        <div className="text-2xl font-bold">${balances.basic.toFixed(2)}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            For training games
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="balance-card pro"
                    >
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                            <Trophy className="w-4 h-4" />
                            Pro Game Balance
                        </div>
                        <div className="text-2xl font-bold gradient-gold-text">${balances.pro.toFixed(2)}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            Eligible for cash out
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="balance-card cash"
                    >
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-2">
                            <Coins className="w-4 h-4" />
                            Cash Account
                        </div>
                        <div className="text-2xl font-bold text-[var(--success)]">${balances.cash.toFixed(2)}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            Available for deposit
                        </div>
                    </motion.div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Quick Actions</h2>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <Link href="/game" className="btn btn-primary justify-center">
                                    <Gamepad2 className="w-5 h-5" />
                                    Play Game
                                </Link>
                                <Link href="/deposit" className="btn btn-secondary justify-center">
                                    <Wallet className="w-5 h-5" />
                                    Deposit
                                </Link>
                                <Link href="/referrals" className="btn btn-secondary justify-center">
                                    <Users className="w-5 h-5" />
                                    Invite Friends
                                </Link>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Account Status</h2>
                                <span className={`badge ${user.status === 'pro' ? 'badge-success' :
                                        user.status === 'basic' ? 'badge-primary' : 'badge-warning'
                                    }`}>
                                    {user.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Progress Steps */}
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        {['Free', 'Basic', 'Pro'].map((status, index) => {
                                            const isActive = ['free', 'basic', 'pro'].indexOf(user.status) >= index;
                                            return (
                                                <div key={status} className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive
                                                            ? 'bg-[var(--gradient-primary)] text-white'
                                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                                                        }`} style={isActive ? { background: 'var(--gradient-primary)' } : {}}>
                                                        {isActive ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                                    </div>
                                                    <span className={`text-xs mt-1 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                                        {status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="absolute top-4 left-8 right-8 h-0.5 bg-[var(--bg-tertiary)]">
                                        <div
                                            className="h-full bg-[var(--primary)]"
                                            style={{
                                                width: user.status === 'pro' ? '100%' : user.status === 'basic' ? '50%' : '0%'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Upgrade Info */}
                                {user.status !== 'pro' && (
                                    <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Zap className="w-5 h-5 text-[var(--accent)]" />
                                            <span className="font-semibold">
                                                {user.status === 'free' ? 'Unlock Basic Game' : 'Upgrade to Pro'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                                            {user.status === 'free'
                                                ? `Deposit ${GAME_CONFIG.basicActivationAmount}+ USDT to activate your account and start playing.`
                                                : `Reach ${GAME_CONFIG.proActivationVolume}+ USDT volume to unlock withdrawals.`
                                            }
                                        </p>
                                        <div className="progress h-2">
                                            <div
                                                className="progress-bar gold"
                                                style={{
                                                    width: `${Math.min(100, (user.totalVolume / GAME_CONFIG.proActivationVolume) * 100)}%`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                            <span>${user.totalVolume.toFixed(0)} Volume</span>
                                            <span>${GAME_CONFIG.proActivationVolume} Required</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Games */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Recent Games</h2>
                                <Link href="/game" className="text-sm text-[var(--primary-light)] hover:underline">
                                    View All
                                </Link>
                            </div>

                            {gameHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {gameHistory.slice(0, 5).map((game) => (
                                        <div key={game.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${game.result === 'win' ? 'bg-[var(--success)]/20' : 'bg-[var(--danger)]/20'
                                                    }`}>
                                                    {game.result === 'win' ? (
                                                        <Trophy className="w-5 h-5 text-[var(--success)]" />
                                                    ) : (
                                                        <Gamepad2 className="w-5 h-5 text-[var(--danger)]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        Lucky Draw #{game.selectedNumber}
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        {new Date(game.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${game.result === 'win' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                                                }`}>
                                                {game.result === 'win' ? '+' : '-'}${game.result === 'win' ? game.payout : game.entryAmount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Gamepad2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                                    <p className="text-[var(--text-secondary)]">No games played yet</p>
                                    <Link href="/game" className="btn btn-primary btn-sm mt-3 inline-flex">
                                        Play First Game
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Referrals & Cashback */}
                    <div className="space-y-6">
                        {/* Referral Card */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Your Referral Link</h2>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-between mb-4">
                                <code className="text-sm text-[var(--primary-light)]">{user.referralCode}</code>
                                <button onClick={copyReferralCode} className="btn btn-sm btn-secondary">
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold">{referralTree.totalReferrals}</div>
                                    <div className="text-xs text-[var(--text-muted)]">Total Referrals</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold gradient-gold-text">
                                        ${referralTree.totalCommissions.toFixed(2)}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">Total Earned</div>
                                </div>
                            </div>
                        </div>

                        {/* Rank Progress */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Rank Progress</h2>
                                {currentRank > 0 && (
                                    <span className={`rank-badge rank-${currentRank}`}>
                                        <Star className="w-4 h-4" />
                                        Rank {currentRank}
                                    </span>
                                )}
                            </div>
                            {nextRank ? (
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[var(--text-secondary)]">Next: {nextRank.name}</span>
                                        <span className="text-[var(--text-muted)]">
                                            ${(nextRank.matchingVolumeRequired / 1000).toFixed(0)}K Required
                                        </span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${Math.min(100, (user.totalVolume / nextRank.matchingVolumeRequired) * 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <Trophy className="w-12 h-12 text-[var(--accent)] mx-auto mb-2" />
                                    <p className="text-[var(--success)]">Maximum rank achieved!</p>
                                </div>
                            )}
                        </div>

                        {/* Cashback Status */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Cashback Protection</h2>
                                <span className={`badge ${cashbackStatus.isActive ? 'badge-success' : 'badge-info'}`}>
                                    {cashbackStatus.isActive ? 'Active' : 'Standby'}
                                </span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Daily Rate</span>
                                    <span className="font-bold text-[var(--success)]">{cashbackStatus.dailyRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Max ROI</span>
                                    <span className="font-bold">{cashbackStatus.maxROI}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Total Losses</span>
                                    <span>${cashbackStatus.totalLosses.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Recovered</span>
                                    <span className="text-[var(--success)]">${cashbackStatus.recoveredAmount.toFixed(2)}</span>
                                </div>
                                {!cashbackStatus.isActive && (
                                    <div className="text-xs text-[var(--text-muted)] p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        Cashback activates when losses reach $100
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Payouts */}
                        {activePayout.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Active Payouts</h2>
                                    <span className="badge badge-success">{activePayout.length}</span>
                                </div>
                                <div className="space-y-3">
                                    {activePayout.slice(0, 3).map((payout) => (
                                        <div key={payout.id} className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm">Daily Payout</span>
                                                <span className="font-bold text-[var(--success)]">
                                                    ${payout.dailyAmount.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="progress h-1">
                                                <div
                                                    className="progress-bar gold"
                                                    style={{ width: `${(payout.paidDays / payout.totalDays) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                                                <span>Day {payout.paidDays}/{payout.totalDays}</span>
                                                <span>${payout.totalAmount.toFixed(2)} total</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
