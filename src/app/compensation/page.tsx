'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Trophy,
    Star,
    TrendingUp,
    Award,
    Crown,
    Gem,
    CheckCircle,
    Lock,
    Clock,
    Coins
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';
import { RANK_LEVELS, REFERRAL_RATES } from '@/types';

export default function CompensationPage() {
    const router = useRouter();
    const { user, ranks, referralTree } = useUserStore();

    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    if (!user) return null;

    const currentRank = ranks.filter(r => r.achieved).length;
    const nextRank = ranks.find(r => !r.achieved);

    const totalReferralIncome = referralTree.totalCommissions;

    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-[var(--accent)]" />
                        Compensation Plan
                    </h1>
                    <p className="page-subtitle">
                        Multiple income streams to maximize your earnings in the Pro Game Ecosystem.
                    </p>
                </div>

                {/* Income Summary */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stat-card"
                    >
                        <div className="stat-label flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Pro-Referral Income
                        </div>
                        <div className="stat-value gradient-gold-text">
                            ${totalReferralIncome.toFixed(2)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            From {referralTree.totalReferrals} referrals
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                    >
                        <div className="stat-label flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Pro-Royalty Income
                        </div>
                        <div className="stat-value text-[var(--primary-light)]">
                            $0.00
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            {currentRank > 0 ? `Rank ${currentRank} Active` : 'Reach Rank 1 to earn'}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                    >
                        <div className="stat-label flex items-center gap-2">
                            <Gem className="w-4 h-4" />
                            Total Earnings
                        </div>
                        <div className="stat-value gradient-text">
                            ${totalReferralIncome.toFixed(2)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            All-time earnings
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Pro-Referral Income */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                                Pro-Referral Income (Level Income)
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Earn commissions on your team&apos;s volume. Requires minimum $100 volume to be eligible.
                        </p>

                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Level</th>
                                        <th>Type</th>
                                        <th>Payout (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-bold text-[var(--primary-light)]">Level 1</td>
                                        <td>Direct Referral</td>
                                        <td className="font-bold text-[var(--success)]">{REFERRAL_RATES.level1}%</td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-[var(--primary-light)]">Level 2</td>
                                        <td>Team Bonus</td>
                                        <td className="font-bold">{REFERRAL_RATES.level2}%</td>
                                    </tr>
                                    {[3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                        <tr key={level}>
                                            <td className="font-bold text-[var(--primary-light)]">Level {level}</td>
                                            <td>Team Bonus</td>
                                            <td className="font-bold">{REFERRAL_RATES.level3to10}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <div className="flex items-center gap-2 text-sm">
                                <Lock className="w-4 h-4 text-[var(--warning)]" />
                                <span className="text-[var(--text-secondary)]">
                                    Your status: <strong>{user.status === 'pro' ? 'Eligible' : 'Not Eligible'}</strong>
                                    {user.status !== 'pro' && ' - Reach $100 volume to unlock'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Pro-Royalty Income */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title flex items-center gap-2">
                                <Crown className="w-5 h-5 text-[var(--accent)]" />
                                Pro-Royalty Income (Rank Achievement)
                            </h2>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            8% of company turnover distributed daily to rank achievers at 11:59 PM (Dubai Time).
                        </p>

                        <div className="table-container max-h-[400px] overflow-y-auto">
                            <table className="table">
                                <thead className="sticky top-0 bg-[var(--bg-tertiary)]">
                                    <tr>
                                        <th>Rank</th>
                                        <th>Daily Share</th>
                                        <th>Volume Req.</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RANK_LEVELS.map((rank, index) => {
                                        const isAchieved = ranks[index]?.achieved;
                                        return (
                                            <tr key={rank.level}>
                                                <td>
                                                    <span className={`rank-badge rank-${rank.level}`}>
                                                        <Star className="w-3 h-3" />
                                                        {rank.name}
                                                    </span>
                                                </td>
                                                <td className="font-bold">{rank.dailyPoolShare}%</td>
                                                <td>${(rank.matchingVolumeRequired / 1000).toFixed(0)}K</td>
                                                <td>
                                                    {isAchieved ? (
                                                        <span className="badge badge-success">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Achieved
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-info">
                                                            <Lock className="w-3 h-3" />
                                                            Locked
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/30">
                            <div className="flex items-start gap-2 text-sm">
                                <Clock className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                                <span className="text-[var(--text-secondary)]">
                                    Royalty requires matching volume (Strong Leg vs. Other Legs). Payouts are
                                    distributed daily at 11:59 PM Dubai Time.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Rank Progress */}
                <div className="card mt-8">
                    <div className="card-header">
                        <h2 className="card-title">Your Rank Progress</h2>
                        {currentRank > 0 && (
                            <span className={`rank-badge rank-${currentRank}`}>
                                <Star className="w-4 h-4" />
                                Rank {currentRank}: {RANK_LEVELS[currentRank - 1]?.name}
                            </span>
                        )}
                    </div>

                    <div className="grid md:grid-cols-8 gap-4">
                        {RANK_LEVELS.map((rank, index) => {
                            const isAchieved = ranks[index]?.achieved;
                            const isCurrent = currentRank === rank.level;
                            return (
                                <motion.div
                                    key={rank.level}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`text-center p-4 rounded-lg border transition-all ${isAchieved
                                            ? 'bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 border-[var(--accent)]/50'
                                            : isCurrent
                                                ? 'bg-[var(--bg-glass)] border-[var(--primary)]'
                                                : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${isAchieved
                                            ? 'bg-[var(--accent)] text-[#0a0a0f]'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                                        }`}>
                                        {isAchieved ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <Lock className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="font-bold text-sm">{rank.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        ${(rank.matchingVolumeRequired / 1000).toFixed(0)}K
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {nextRank && (
                        <div className="mt-6 p-4 rounded-lg bg-[var(--bg-tertiary)]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-[var(--text-secondary)]">
                                    Progress to {nextRank.name} (Rank {nextRank.level})
                                </span>
                                <span className="text-sm font-bold">
                                    ${user.totalVolume.toFixed(0)} / ${(nextRank.matchingVolumeRequired).toLocaleString()}
                                </span>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar gold"
                                    style={{ width: `${Math.min(100, (user.totalVolume / nextRank.matchingVolumeRequired) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Cashback Boost Info */}
                <div className="card mt-8">
                    <div className="card-header">
                        <h2 className="card-title flex items-center gap-2">
                            <Coins className="w-5 h-5 text-[var(--secondary)]" />
                            Referral Cashback Boost
                        </h2>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Invite friends with minimum $100 volume to increase your daily cashback rate and ROI cap.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { referrals: '0', rate: '0.5%', roi: '100%' },
                            { referrals: '1+', rate: '1.0%', roi: '100%' },
                            { referrals: '5+', rate: '1.0%', roi: '200%' },
                            { referrals: '9+', rate: '2.0%', roi: '200%' },
                        ].map((tier, index) => (
                            <motion.div
                                key={tier.referrals}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-center"
                            >
                                <div className="text-2xl font-bold mb-1">{tier.referrals}</div>
                                <div className="text-xs text-[var(--text-muted)] mb-3">Referrals</div>
                                <div className="text-xl font-bold gradient-gold-text">{tier.rate}</div>
                                <div className="text-xs text-[var(--text-muted)]">Daily Rate</div>
                                <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                                    <span className="badge badge-success">{tier.roi} Max ROI</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
