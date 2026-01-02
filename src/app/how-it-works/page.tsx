'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Gift,
    Lock,
    Users,
    Wallet,
    Gamepad2,
    Trophy,
    Shield,
    AlertTriangle,
    CheckCircle,
    Ban,
    ArrowRight,
    Clock,
    DollarSign,
    TrendingUp,
    Star,
    Zap,
    Crown,
    Target
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';

export default function HowItWorksPage() {
    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-gold-text">Pro Game Ecosystem</span>: Official Guide
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        <span className="text-gold font-bold">Play Smart. Win Big. Zero Risk.</span>
                    </p>
                    <p className="text-[var(--text-secondary)] max-w-3xl mx-auto mt-4">
                        Welcome to Pro Game, a transparent, decentralized gaming platform on the BEP20 Blockchain.
                        Participate in our exciting Lucky Number Draw where you either win 8x your entry or activate
                        our unique Cashback Protection.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Part 1: Free Registration & Frozen Rewards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 1: Free Registration & Frozen Rewards</h2>
                        </div>
                        <div className="gold-card-body">
                            {/* Main Bonus Display */}
                            <div className="text-center mb-6">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <Gift className="w-10 h-10 text-gold" />
                                    <span className="text-4xl font-bold gradient-gold-text">10 USDT</span>
                                </div>
                                <p className="text-[var(--text-secondary)]">FREE SIGN-UP BONUS</p>
                            </div>

                            <p className="text-sm text-[var(--text-secondary)] mb-4 text-center">
                                Start for free. New members join instantly and earn bonuses that are initially locked.
                            </p>

                            {/* Status Badge */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <Lock className="w-5 h-5 text-gold" />
                                <span className="text-gold font-bold">STATUS: FROZEN BALANCE</span>
                            </div>
                            <p className="text-xs text-center text-[var(--text-muted)] mb-4">(Bonus Locked)</p>

                            {/* Frozen Referral Rewards */}
                            <div className="gold-card-section">
                                <h4 className="text-center text-gold font-bold mb-3">FROZEN REFERRAL REWARDS</h4>
                                <p className="text-xs text-center text-[var(--text-muted)] mb-4">(Based on 10 USDT base)</p>

                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className="icon-circle outline mx-auto mb-2">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm">Level 1: <span className="text-gold font-bold">10%</span></p>
                                    </div>
                                    <div>
                                        <div className="icon-circle outline mx-auto mb-2">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm">Level 2: <span className="text-gold font-bold">2%</span></p>
                                    </div>
                                    <div>
                                        <div className="icon-circle outline mx-auto mb-2">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm">Level 3-10: <span className="text-gold font-bold">1%</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Condition */}
                            <div className="info-box warning flex items-center gap-2 mt-4">
                                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                                <span className="text-sm">Condition: Only 10 Directs limit applies.</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Part 2: Unlocking The Basic Game */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 2: Unlocking The Basic Game</h2>
                        </div>
                        <div className="gold-card-body">
                            {/* Step 1 */}
                            <div className="step-badge inline-block mb-4">Step 1: Basic Activation</div>

                            <div className="gold-card-section mb-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <Wallet className="w-6 h-6 text-gold flex-shrink-0" />
                                    <div>
                                        <p className="text-gold font-bold">Requirement:</p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Deposit 10+ USDT (One-time or accumulated)
                                        </p>
                                    </div>
                                </div>

                                <div className="info-box warning mb-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-warning" />
                                        <span className="text-sm text-warning font-bold">Deadline:</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        Free IDs deleted after 10 days if not activated.
                                    </p>
                                </div>

                                <div className="flex items-start gap-2">
                                    <ArrowRight className="w-5 h-5 text-gold flex-shrink-0" />
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        <span className="text-gold font-bold">BENEFIT:</span> ALL Frozen Balance transfers to Basic Game Account.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="step-badge inline-block mb-4">Step 2: Basic Game Mechanics</div>

                            <div className="gold-card-section">
                                <div className="flex items-start gap-3 mb-3">
                                    <Gamepad2 className="w-6 h-6 text-gold flex-shrink-0" />
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Play with Basic Balance. <span className="text-gold font-bold">Win 8X Potential.</span>
                                    </p>
                                </div>

                                <div className="info-box danger">
                                    <div className="flex items-center gap-2">
                                        <Ban className="w-4 h-4 text-danger" />
                                        <span className="text-sm text-danger font-bold">RESTRICTION:</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        Winnings are LOCKED. Not eligible for Cash Out (Internal Use Only).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Part 3: The Bridge to Cash (Pro Upgrade) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 3: The Bridge to Cash (Pro Upgrade)</h2>
                        </div>
                        <div className="gold-card-body">
                            <div className="text-center mb-4">
                                <p className="text-[var(--text-secondary)]">
                                    To <span className="text-danger font-bold">CASH OUT</span> rewards, convert to <span className="text-gold font-bold">PRO Status</span>.
                                </p>
                            </div>

                            <h4 className="text-gold font-bold text-center mb-4">HOW TO ACTIVATE PRO STATUS</h4>

                            <div className="gold-card-section mb-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="icon-circle gold">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gold font-bold">Requirement:</p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Achieve 100+ USDT Volume (Deposit 100+ USDT)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Flow Diagram */}
                            <div className="flex items-center justify-center gap-4 my-6">
                                <div className="bg-[var(--bg-tertiary)] border border-[var(--gold)] rounded-lg px-4 py-3 text-center">
                                    <p className="text-sm font-bold">BASIC GAME</p>
                                    <p className="text-xs text-[var(--text-muted)]">BALANCE</p>
                                </div>
                                <ArrowRight className="w-8 h-8 text-gold" />
                                <div className="bg-[var(--bg-tertiary)] border border-[var(--gold)] rounded-lg px-4 py-3 text-center">
                                    <p className="text-sm font-bold">PRO GAME</p>
                                    <p className="text-xs text-[var(--text-muted)]">ACCOUNT</p>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <p className="text-sm text-[var(--text-secondary)]">
                                    <span className="text-gold font-bold">THE CONVERSION:</span> Basic Balance becomes convertible and transferable to Pro Game Account.
                                </p>
                            </div>

                            <div className="info-box">
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        <span className="text-gold">Note:</span> Transfer limits follow Pro-Referral Income structure (Level 1–10).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Part 4: The Pro Game (Real Cash Out) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 4: The Pro Game (Real Cash Out)</h2>
                        </div>
                        <div className="gold-card-body">
                            <div className="text-center mb-4 p-3 bg-[var(--bg-tertiary)] rounded-lg">
                                <p>Play for withdrawable <span className="text-gold font-bold">USDT</span>.</p>
                            </div>

                            <h4 className="text-gold font-bold text-center mb-4">WINNING MECHANICS</h4>

                            <div className="gold-card-section mb-4">
                                <div className="flex items-start gap-3">
                                    <Trophy className="w-8 h-8 text-gold flex-shrink-0" />
                                    <div>
                                        <p><span className="text-gold font-bold">Multiplier:</span> Win 8X your entry fee.</p>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            <span className="text-gold font-bold">Payout:</span> Automated to USDT BEP20 wallet in 10 equal daily distributions.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-gold font-bold text-center mb-3">CASHBACK PROTECTION (No-Loss Guarantee)</h4>

                            <div className="gold-card-section mb-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-8 h-8 text-gold flex-shrink-0" />
                                    <div>
                                        <p><span className="text-gold font-bold">Trigger:</span> Total losses reach $100+.</p>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                            <span className="text-gold font-bold">Base Rate:</span> 0.5% Daily Cashback until 100% recovered.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h4 className="text-center font-bold mb-3">REFERRAL CASHBACK BOOST</h4>

                            <div className="table-container">
                                <table className="table text-sm">
                                    <thead>
                                        <tr>
                                            <th>Referral Tier</th>
                                            <th>Daily Cashback</th>
                                            <th>Max ROI Cap</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>0 Referrals</td>
                                            <td>0.5% Daily</td>
                                            <td>100% Capital</td>
                                        </tr>
                                        <tr>
                                            <td>1+ Referral</td>
                                            <td>1.0% Daily</td>
                                            <td>100% Capital</td>
                                        </tr>
                                        <tr>
                                            <td>5+ Referrals</td>
                                            <td>1.0% Daily</td>
                                            <td>200% Capital</td>
                                        </tr>
                                        <tr>
                                            <td>9+ Referrals</td>
                                            <td>2.0% Daily</td>
                                            <td>200% Capital</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {/* Part 5: Compensation Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 5: Compensation Plan</h2>
                        </div>
                        <div className="gold-card-body">
                            <h4 className="text-gold font-bold mb-3">1️⃣ Pro-Referral Income (Level Income)</h4>
                            <p className="text-xs text-[var(--text-muted)] mb-3">Eligibility: Min $100 Volume</p>

                            <div className="table-container mb-6">
                                <table className="table text-sm">
                                    <thead>
                                        <tr>
                                            <th>Level</th>
                                            <th>Type</th>
                                            <th>Payout</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Level 1</td>
                                            <td>Direct Referral</td>
                                            <td className="font-bold">10%</td>
                                        </tr>
                                        <tr>
                                            <td>Level 2</td>
                                            <td>Team Bonus</td>
                                            <td className="font-bold">2%</td>
                                        </tr>
                                        <tr>
                                            <td>Level 3-10</td>
                                            <td>Team Bonus</td>
                                            <td className="font-bold">1% each</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h4 className="text-gold font-bold mb-3">2️⃣ Pro-Royalty Income (Rank Achievement)</h4>
                            <p className="text-xs text-[var(--text-muted)] mb-3">
                                8% of Company Turnover distributed daily at 11:59 PM (Dubai Time)
                            </p>

                            <div className="space-y-2 text-sm">
                                {[
                                    { rank: 1, share: '1.00%', volume: '$10K' },
                                    { rank: 2, share: '1.00%', volume: '$50K' },
                                    { rank: 3, share: '1.00%', volume: '$100K' },
                                    { rank: 4, share: '1.00%', volume: '$500K' },
                                ].map((item) => (
                                    <div key={item.rank} className="flex justify-between items-center p-2 bg-[var(--bg-tertiary)] rounded">
                                        <span className={`rank-badge rank-${item.rank}`}>
                                            <Star className="w-3 h-3" /> Rank {item.rank}
                                        </span>
                                        <span>{item.share}</span>
                                        <span className="text-[var(--text-muted)]">{item.volume}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Part 6: Security Protocols & Comparison */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="gold-card"
                    >
                        <div className="gold-card-header">
                            <h2 className="text-lg">Part 6: Security Protocols & Comparison</h2>
                        </div>
                        <div className="gold-card-body">
                            <div className="info-box warning mb-4">
                                <h4 className="flex items-center gap-2 text-warning font-bold mb-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    CRITICAL OPERATIONAL & SECURITY PROTOCOLS
                                </h4>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <Lock className="w-5 h-5 text-gold flex-shrink-0" />
                                    <p className="text-sm">
                                        <span className="text-gold font-bold">IRREVERSIBLE WALLET LINKING:</span> You cannot change your wallet address once registered. Withdrawals are automated to that address forever.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <DollarSign className="w-5 h-5 text-gold flex-shrink-0" />
                                    <p className="text-sm">
                                        <span className="text-gold font-bold">Play Limit:</span> $1,000 per Unique ID.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Shield className="w-5 h-5 text-gold flex-shrink-0" />
                                    <p className="text-sm">
                                        <span className="text-gold font-bold">Balance Safety:</span> Improper management can lead to burnt funds.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Target className="w-5 h-5 text-gold flex-shrink-0" />
                                    <p className="text-sm">
                                        <span className="text-gold font-bold">Transparency:</span> 100% decentralized and verifiable.
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-center font-bold mb-3 flex items-center justify-center gap-2">
                                <span className="text-2xl">VS</span> COMPARISON: WHY WE ARE BETTER
                            </h4>

                            <div className="table-container">
                                <table className="table text-xs">
                                    <thead>
                                        <tr>
                                            <th>Feature</th>
                                            <th className="text-danger">❌ Traditional</th>
                                            <th className="text-success">✅ Pro Game</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Winning Odds</td>
                                            <td>Very Low</td>
                                            <td className="text-success">High (1 in 10)</td>
                                        </tr>
                                        <tr>
                                            <td>If You Lose</td>
                                            <td>Lose 100%</td>
                                            <td className="text-success">Cashback Protection</td>
                                        </tr>
                                        <tr>
                                            <td>Payouts</td>
                                            <td>Manual, Slow</td>
                                            <td className="text-success">Automated (Smart Contract)</td>
                                        </tr>
                                        <tr>
                                            <td>Referral Income</td>
                                            <td>None</td>
                                            <td className="text-success">10 Levels + Royalty</td>
                                        </tr>
                                        <tr>
                                            <td>Transparency</td>
                                            <td>Hidden</td>
                                            <td className="text-success">100% Transparent</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div className="gold-card inline-block max-w-xl">
                        <div className="gold-card-header">
                            <h2 className="text-xl">Ready to Start Winning?</h2>
                        </div>
                        <div className="gold-card-body text-center">
                            <p className="text-[var(--text-secondary)] mb-6">
                                Join thousands of players and get your free 10 USDT bonus today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/register" className="btn btn-gold btn-lg">
                                    <Gift className="w-5 h-5" />
                                    Get Free 10 USDT
                                </Link>
                                <Link href="/game" className="btn btn-secondary btn-lg">
                                    <Gamepad2 className="w-5 h-5" />
                                    Play Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
