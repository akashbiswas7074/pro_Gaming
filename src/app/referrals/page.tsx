'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    Copy,
    Share2,
    Gift,
    TrendingUp,
    CheckCircle,
    Clock,
    Star,
    ChevronRight,
    Link2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';
import { REFERRAL_RATES, GAME_CONFIG } from '@/types';

export default function ReferralsPage() {
    const router = useRouter();
    const { user, referralTree } = useUserStore();

    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    if (!user) return null;

    const referralLink = typeof window !== 'undefined'
        ? `${window.location.origin}/register?ref=${user.referralCode}`
        : '';

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
    };

    const shareLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join Pro Game Ecosystem',
                text: 'Get 10 USDT free bonus and start winning!',
                url: referralLink,
            });
        }
    };

    const levelData = [
        { level: 1, type: 'Direct Referral', percentage: REFERRAL_RATES.level1, count: referralTree.level1.length },
        { level: 2, type: 'Team Bonus', percentage: REFERRAL_RATES.level2, count: referralTree.level2.length },
        ...Array.from({ length: 8 }, (_, i) => ({
            level: i + 3,
            type: 'Team Bonus',
            percentage: REFERRAL_RATES.level3to10,
            count: referralTree.level3to10.filter(r => r.level === i + 3).length,
        })),
    ];

    const totalEarnings = {
        level1: referralTree.level1.reduce((sum, r) => sum + r.commission, 0),
        level2: referralTree.level2.reduce((sum, r) => sum + r.commission, 0),
        level3to10: referralTree.level3to10.reduce((sum, r) => sum + r.commission, 0),
    };

    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title flex items-center gap-3">
                        <Users className="w-8 h-8 text-[var(--primary)]" />
                        Referral Program
                    </h1>
                    <p className="page-subtitle">
                        Invite friends and earn commissions on 10 levels of your network.
                    </p>
                </div>

                {/* Referral Link Card */}
                <div className="card mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold mb-2">Your Referral Link</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 p-3 rounded-lg bg-[var(--bg-tertiary)] font-mono text-sm truncate">
                                    {referralLink}
                                </div>
                                <button onClick={copyLink} className="btn btn-secondary">
                                    <Copy className="w-4 h-4" />
                                    Copy
                                </button>
                                <button onClick={shareLink} className="btn btn-primary">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-[var(--bg-glass)]">
                            <div className="text-3xl font-bold gradient-gold-text mb-1">
                                {user.referralCode}
                            </div>
                            <div className="text-sm text-[var(--text-muted)]">Your Code</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="stat-card"
                    >
                        <div className="stat-label">Total Referrals</div>
                        <div className="stat-value">{referralTree.totalReferrals}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                    >
                        <div className="stat-label">Direct Referrals</div>
                        <div className="stat-value">{referralTree.level1.length}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                            Limit: {GAME_CONFIG.frozenReferralLimit} (for frozen bonus)
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                    >
                        <div className="stat-label">Total Commissions</div>
                        <div className="stat-value gradient-gold-text">
                            ${referralTree.totalCommissions.toFixed(2)}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="stat-card"
                    >
                        <div className="stat-label">Active Network</div>
                        <div className="stat-value">
                            {referralTree.level1.filter(r => r.status === 'activated').length +
                                referralTree.level2.filter(r => r.status === 'activated').length +
                                referralTree.level3to10.filter(r => r.status === 'activated').length}
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Commission Structure */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Commission Structure</h2>
                                <span className="badge badge-primary">10 Levels</span>
                            </div>

                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Level</th>
                                            <th>Type</th>
                                            <th>Commission</th>
                                            <th>Referrals</th>
                                            <th>Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {levelData.map((level) => (
                                            <tr key={level.level}>
                                                <td>
                                                    <span className="font-bold text-[var(--primary-light)]">
                                                        Level {level.level}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={level.level === 1 ? 'text-[var(--success)]' : ''}>
                                                        {level.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-bold">{level.percentage}%</span>
                                                </td>
                                                <td>{level.count}</td>
                                                <td className="font-bold gradient-gold-text">
                                                    ${(level.level === 1
                                                        ? totalEarnings.level1
                                                        : level.level === 2
                                                            ? totalEarnings.level2
                                                            : totalEarnings.level3to10 / 8
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Referrals */}
                        <div className="card mt-6">
                            <div className="card-header">
                                <h2 className="card-title">Recent Referrals</h2>
                            </div>

                            {referralTree.level1.length > 0 ? (
                                <div className="space-y-3">
                                    {referralTree.level1.slice(0, 5).map((referral) => (
                                        <div key={referral.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-[var(--primary)]" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {referral.referredUserId.slice(0, 8)}...
                                                    </div>
                                                    <div className="text-xs text-[var(--text-muted)]">
                                                        Level {referral.level} • {new Date(referral.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`badge ${referral.status === 'pro' ? 'badge-success' :
                                                        referral.status === 'activated' ? 'badge-primary' : 'badge-warning'
                                                    }`}>
                                                    {referral.status}
                                                </div>
                                                <div className="text-sm font-bold mt-1">
                                                    +${referral.commission.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Gift className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                                    <p className="text-[var(--text-secondary)]">No referrals yet</p>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        Share your referral link to start earning
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Frozen Referral Bonus */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Frozen Referral Bonus</h2>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Earn a percentage of the 10 USDT base for every person you refer
                                (up to {GAME_CONFIG.frozenReferralLimit} direct referrals).
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Level 1</span>
                                    <span className="font-bold">10% = $1.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Level 2</span>
                                    <span className="font-bold">2% = $0.20</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Level 3-10</span>
                                    <span className="font-bold">1% = $0.10 each</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30">
                                <div className="flex items-start gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">
                                        These bonuses go to your <strong>Frozen Balance</strong> and
                                        unlock when you activate your account.
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pro Requirement */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Pro Referral Income</h2>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Earn commissions on your team&apos;s volume when you achieve Pro status.
                            </p>
                            <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-[var(--accent)]" />
                                    <span className="font-medium">Eligibility</span>
                                </div>
                                <p className="text-sm text-[var(--text-muted)]">
                                    Minimum $100 Volume Required
                                </p>
                            </div>
                        </div>

                        {/* Share Tips */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">Sharing Tips</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">
                                        Share on social media with your referral link
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">
                                        Explain the 8X winning and cashback protection
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">
                                        Mention the free 10 USDT sign-up bonus
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">
                                        Help your referrals upgrade to Pro for higher commissions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
