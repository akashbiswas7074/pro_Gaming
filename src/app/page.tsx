'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Gift,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Trophy,
  Coins,
  ChevronRight,
  Star
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';

const features = [
  {
    icon: Shield,
    title: 'Zero Risk Gaming',
    description: 'Unique cashback protection ensures you never lose. Recover up to 100% of your capital.',
    gradient: 'from-[#8b5cf6] to-[#06b6d4]'
  },
  {
    icon: Zap,
    title: '8X Multiplier',
    description: 'Win 8 times your entry fee in every Lucky Number Draw. Higher rewards, better odds.',
    gradient: 'from-[#f59e0b] to-[#fbbf24]'
  },
  {
    icon: Users,
    title: '10-Level Referrals',
    description: 'Build your network and earn commissions on 10 levels. Up to 10% on direct referrals.',
    gradient: 'from-[#10b981] to-[#059669]'
  },
  {
    icon: TrendingUp,
    title: 'Daily Royalties',
    description: '8% of company turnover distributed daily to rank achievers. Passive income stream.',
    gradient: 'from-[#ec4899] to-[#f43f5e]'
  },
];

const stats = [
  { value: '$50M+', label: 'Total Volume' },
  { value: '100K+', label: 'Active Users' },
  { value: '1 in 10', label: 'Win Odds' },
  { value: '8X', label: 'Win Multiplier' },
];

const comparisonData = [
  { feature: 'Winning Odds', traditional: 'Very Low (1 in Million)', proGame: 'High (1 in 10)' },
  { feature: 'If You Lose', traditional: 'Lose 100% of money', proGame: 'Cashback Protection (100%)' },
  { feature: 'Payouts', traditional: 'Manual, slow, KYC', proGame: 'Automated Smart Contract' },
  { feature: 'Referral Income', traditional: 'None', proGame: '10 Levels + Royalty' },
  { feature: 'Transparency', traditional: 'Hidden algorithms', proGame: '100% On Blockchain' },
];

const steps = [
  { number: '01', title: 'Connect Wallet', description: 'Link your BEP20 wallet (MetaMask, Trust Wallet)' },
  { number: '02', title: 'Get Bonus', description: 'Receive 10 USDT sign-up bonus instantly' },
  { number: '03', title: 'Activate & Play', description: 'Deposit 10+ USDT to unlock Basic Game' },
  { number: '04', title: 'Win or Recover', description: 'Win 8X or activate cashback protection' },
];

export default function HomePage() {
  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8b5cf6]/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b5cf6]/20 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06b6d4]/20 rounded-full filter blur-[128px]" />

        <div className="container relative z-10 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-glass)] border border-[var(--border-color)] text-sm mb-8">
              <Sparkles className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">Decentralized Gaming on BEP20</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Play Smart.</span>
              <span className="block gradient-text">Win Big.</span>
              <span className="block text-[var(--accent)]">Zero Risk.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
              The first transparent gaming platform where you either win 8X your entry
              or activate our unique <span className="text-[var(--primary-light)]">Cashback Protection</span> system.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="btn btn-primary btn-lg pulse-glow">
                <Gift className="w-5 h-5" />
                Get Free 10 USDT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/game" className="btn btn-secondary btn-lg">
                <Coins className="w-5 h-5" />
                Try Demo Game
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold gradient-gold-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">Pro Game</span>?
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Experience the future of gaming with transparent, decentralized mechanics
              and unmatched earning potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start in <span className="gradient-gold-text">4 Simple Steps</span>
            </h2>
            <p className="text-[var(--text-secondary)]">
              From registration to winning - faster than any traditional platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card p-6 h-full">
                  <div className="text-5xl font-bold text-[var(--primary)]/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-[var(--primary)]/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why We Are <span className="gradient-text">Better</span>
            </h2>
            <p className="text-[var(--text-secondary)]">
              See how Pro Game compares to traditional lottery and betting platforms.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="text-center">Traditional</th>
                    <th className="text-center">Pro Game</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.feature}>
                      <td className="font-medium">{row.feature}</td>
                      <td className="text-center">
                        <span className="text-[var(--danger)]">{row.traditional}</span>
                      </td>
                      <td className="text-center">
                        <span className="flex items-center justify-center gap-2 text-[var(--success)]">
                          <CheckCircle className="w-4 h-4" />
                          {row.proGame}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Cashback Protection Section */}
      <section className="py-20">
        <div className="container">
          <div className="glass-card p-8 md:p-12 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/20 rounded-full filter blur-[100px]" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-sm mb-4">
                  <Shield className="w-4 h-4" />
                  No-Loss Guarantee
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Cashback Protection
                </h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  If your total losses reach $100+, our system automatically activates
                  daily cashback rewards until you recover 100% of your initial capital.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    <span>0.5% - 2.0% daily cashback based on referrals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    <span>Up to 200% ROI cap with 5+ referrals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                    <span>Automated payouts via smart contract</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { referrals: '0', rate: '0.5%', roi: '100%' },
                  { referrals: '1+', rate: '1.0%', roi: '100%' },
                  { referrals: '5+', rate: '1.0%', roi: '200%' },
                  { referrals: '9+', rate: '2.0%', roi: '200%' },
                ].map((tier) => (
                  <div key={tier.referrals} className="card text-center">
                    <div className="text-lg font-bold mb-1">{tier.referrals}</div>
                    <div className="text-xs text-[var(--text-muted)] mb-3">Referrals</div>
                    <div className="text-2xl font-bold gradient-gold-text">{tier.rate}</div>
                    <div className="text-xs text-[var(--text-muted)]">Daily</div>
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                      <span className="badge badge-success">{tier.roi} ROI</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[var(--accent)] fill-[var(--accent)]" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Winning?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Join thousands of players already winning big on the most transparent
              gaming platform in crypto. Get your free 10 USDT bonus today.
            </p>
            <Link href="/register" className="btn btn-gold btn-lg">
              <Gift className="w-5 h-5" />
              Claim Free 10 USDT Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
