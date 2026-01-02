'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Shield,
    Users,
    Wallet,
    TrendingUp,
    Settings,
    Eye,
    Lock,
    Database,
    Activity,
    DollarSign,
    PieChart,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Coins,
    Building
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';

// Mock admin data
const mockAdminData = {
    totalUsers: 12453,
    activeUsers: 8234,
    totalDeposits: 2456789,
    todayDeposits: 34567,
    totalGames: 45678,
    todayGames: 1234,
    totalPayouts: 1987654,
    pendingPayouts: 12345,
    masterWalletBalance: 456789,
    bdWallets: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        balance: Math.random() * 10000,
        lastDistribution: new Date(Date.now() - Math.random() * 86400000),
    })),
    promoterWallets: Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        balance: Math.random() * 50000,
        personalTreeVolume: Math.random() * 100000,
    })),
};

export default function AdminPage() {
    const router = useRouter();
    const { user } = useUserStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'wallets' | 'users' | 'settings'>('overview');
    const [adminRole, setAdminRole] = useState<'super' | 'normal'>('super');

    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    if (!user) return null;

    const stats = [
        { label: 'Total Users', value: mockAdminData.totalUsers.toLocaleString(), icon: Users, change: '+12%', positive: true },
        { label: 'Total Deposits', value: `$${(mockAdminData.totalDeposits / 1000).toFixed(1)}K`, icon: DollarSign, change: '+8%', positive: true },
        { label: 'Today Games', value: mockAdminData.todayGames.toLocaleString(), icon: Activity, change: '+24%', positive: true },
        { label: 'Pending Payouts', value: `$${mockAdminData.pendingPayouts.toLocaleString()}`, icon: Coins, change: '-5%', positive: false },
    ];

    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="page-header">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="page-title flex items-center gap-3">
                                <Shield className="w-8 h-8 text-[var(--primary)]" />
                                Admin Dashboard
                            </h1>
                            <p className="page-subtitle">
                                Manage the Pro Game Ecosystem platform.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={adminRole}
                                onChange={(e) => setAdminRole(e.target.value as 'super' | 'normal')}
                                className="input w-auto"
                            >
                                <option value="super">Super Admin</option>
                                <option value="normal">Normal Admin</option>
                            </select>
                            <span className={`badge ${adminRole === 'super' ? 'badge-success' : 'badge-info'}`}>
                                {adminRole === 'super' ? (
                                    <>
                                        <CheckCircle className="w-3 h-3" />
                                        Full Access
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3" />
                                        View Only
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Admin Role Warning */}
                {adminRole === 'normal' && (
                    <div className="mb-6 p-4 rounded-lg bg-[var(--warning)]/10 border border-[var(--warning)]/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-[var(--warning)]">View Only Mode</div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Normal admins have read-only access. Switch to Super Admin to modify settings.
                            </p>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: PieChart },
                        { id: 'wallets', label: 'Wallets', icon: Wallet },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-[var(--primary)] text-white'
                                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="stat-card"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="stat-label">{stat.label}</div>
                                            <Icon className="w-5 h-5 text-[var(--primary)]" />
                                        </div>
                                        <div className="stat-value">{stat.value}</div>
                                        <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                                            {stat.change} from yesterday
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Master Wallet */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title flex items-center gap-2">
                                    <Building className="w-5 h-5 text-[var(--accent)]" />
                                    Master Wallet
                                </h2>
                                <span className="badge badge-success">Active</span>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                    <div className="text-sm text-[var(--text-muted)] mb-1">Current Balance</div>
                                    <div className="text-2xl font-bold gradient-gold-text">
                                        ${mockAdminData.masterWalletBalance.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                    <div className="text-sm text-[var(--text-muted)] mb-1">Today&apos;s Deposits</div>
                                    <div className="text-2xl font-bold text-[var(--success)]">
                                        +${mockAdminData.todayDeposits.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                    <div className="text-sm text-[var(--text-muted)] mb-1">Distribution Rate</div>
                                    <div className="text-2xl font-bold">10%</div>
                                    <div className="text-xs text-[var(--text-muted)]">Per Cash Deposit</div>
                                </div>
                            </div>
                        </div>

                        {/* Distribution Logic */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Standard Distribution (Active Days)</h2>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            Master Wallet receives 10% of each cash deposit
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            Distributed equally among all 20 BD Wallets
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            Frequency: After each game (hourly)
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            Remaining income goes to Creator Wallet
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h2 className="card-title">Zero Deposit Condition</h2>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            Triggers when system deposits are zero for a day
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RefreshCw className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            After 11:59 PM Dubai Time, Master Wallet receives 1% from System Balance
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Coins className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">
                                            1% equally distributed among all BD Wallets
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wallets Tab */}
                {activeTab === 'wallets' && (
                    <div className="space-y-8">
                        {/* BD Wallets */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title flex items-center gap-2">
                                    <Database className="w-5 h-5 text-[var(--primary)]" />
                                    Business Development Wallets (20)
                                </h2>
                                <span className="badge badge-primary">BD Wallets</span>
                            </div>
                            <div className="table-container max-h-[400px]">
                                <table className="table">
                                    <thead className="sticky top-0 bg-[var(--bg-tertiary)]">
                                        <tr>
                                            <th>#</th>
                                            <th>Wallet Address</th>
                                            <th>Balance</th>
                                            <th>Last Distribution</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockAdminData.bdWallets.map((wallet) => (
                                            <tr key={wallet.id}>
                                                <td className="font-bold">{wallet.id}</td>
                                                <td>
                                                    <code className="text-xs text-[var(--text-secondary)]">
                                                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                                                    </code>
                                                </td>
                                                <td className="font-bold">${wallet.balance.toFixed(2)}</td>
                                                <td className="text-[var(--text-muted)]">
                                                    {wallet.lastDistribution.toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Promoter Wallets */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
                                    Promoter Wallets (4)
                                </h2>
                                <span className="badge badge-success">Promoters</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Promoter wallets receive 5% of each deposit from their personal tree.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {mockAdminData.promoterWallets.map((wallet) => (
                                    <div key={wallet.id} className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold">Promoter #{wallet.id}</span>
                                            <span className="badge badge-info">5% Share</span>
                                        </div>
                                        <code className="text-xs text-[var(--text-muted)] block mb-3">
                                            {wallet.address.slice(0, 16)}...{wallet.address.slice(-8)}
                                        </code>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)]">Balance</div>
                                                <div className="font-bold">${wallet.balance.toFixed(2)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-[var(--text-muted)]">Tree Volume</div>
                                                <div className="font-bold">${(wallet.personalTreeVolume / 1000).toFixed(1)}K</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {adminRole === 'super' && (
                                <button className="btn btn-primary mt-4">
                                    <TrendingUp className="w-4 h-4" />
                                    Create New Promoter Wallet
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">User Management</h2>
                            <span className="badge badge-info">{mockAdminData.totalUsers.toLocaleString()} Users</span>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="text-sm text-[var(--text-muted)] mb-1">Total Users</div>
                                <div className="text-xl font-bold">{mockAdminData.totalUsers.toLocaleString()}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="text-sm text-[var(--text-muted)] mb-1">Active Users</div>
                                <div className="text-xl font-bold text-[var(--success)]">{mockAdminData.activeUsers.toLocaleString()}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="text-sm text-[var(--text-muted)] mb-1">Basic Status</div>
                                <div className="text-xl font-bold text-[var(--primary)]">
                                    {Math.floor(mockAdminData.totalUsers * 0.6).toLocaleString()}
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
                                <div className="text-sm text-[var(--text-muted)] mb-1">Pro Status</div>
                                <div className="text-xl font-bold text-[var(--accent)]">
                                    {Math.floor(mockAdminData.totalUsers * 0.25).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-center py-8 text-[var(--text-muted)]">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Full user management interface would be displayed here</p>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="card-title">Platform Settings</h2>
                            {adminRole === 'normal' && (
                                <span className="badge badge-warning">
                                    <Lock className="w-3 h-3" />
                                    Read Only
                                </span>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="input-group">
                                    <label className="input-label">Win Multiplier</label>
                                    <input
                                        type="number"
                                        value={8}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Max Play Volume (per ID)</label>
                                    <input
                                        type="number"
                                        value={1000}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Basic Activation Amount</label>
                                    <input
                                        type="number"
                                        value={10}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Pro Activation Volume</label>
                                    <input
                                        type="number"
                                        value={100}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Signup Bonus</label>
                                    <input
                                        type="number"
                                        value={10}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Free ID Expiry (Days)</label>
                                    <input
                                        type="number"
                                        value={10}
                                        disabled={adminRole === 'normal'}
                                        className="input"
                                    />
                                </div>
                            </div>

                            {adminRole === 'super' && (
                                <button className="btn btn-primary">
                                    <Settings className="w-4 h-4" />
                                    Save Settings
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
