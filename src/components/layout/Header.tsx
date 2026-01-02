'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Wallet,
    Menu,
    X,
    Gamepad2,
    LayoutDashboard,
    Users,
    Trophy,
    Settings,
    LogOut,
    Coins,
    Shield
} from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/game', label: 'Play Game', icon: Gamepad2 },
    { href: '/how-it-works', label: 'How It Works', icon: Coins },
    { href: '/referrals', label: 'Referrals', icon: Users },
    { href: '/compensation', label: 'Compensation', icon: Trophy },
    { href: '/admin', label: 'Admin', icon: Shield },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, wallet, disconnectWallet, resetUser } = useUserStore();

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleDisconnect = () => {
        disconnectWallet();
        resetUser();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-color)]">
            <div className="container h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        <Coins className="w-6 h-6 text-white" />
                    </motion.div>
                    <span className="text-xl font-bold gradient-text hidden sm:block">
                        Pro Game
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                    ? 'bg-[var(--bg-glass)] text-[var(--primary-light)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Wallet & User Section */}
                <div className="flex items-center gap-3">
                    {wallet?.isConnected && user ? (
                        <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <span className={`badge ${user.status === 'pro' ? 'badge-success' :
                                user.status === 'basic' ? 'badge-primary' : 'badge-warning'
                                }`}>
                                {user.status.toUpperCase()}
                            </span>

                            {/* Wallet Address */}
                            <div className="hidden md:flex wallet-address">
                                <Wallet className="w-4 h-4 text-[var(--primary)]" />
                                <span>{truncateAddress(wallet.address)}</span>
                            </div>

                            {/* Disconnect */}
                            <button
                                onClick={handleDisconnect}
                                className="btn btn-secondary btn-sm"
                                title="Disconnect"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/register" className="btn btn-primary">
                            <Wallet className="w-4 h-4" />
                            <span className="hidden sm:inline">Connect Wallet</span>
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-glass)]"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)]"
                >
                    <div className="container py-4 flex flex-col gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-[var(--bg-glass)] text-[var(--primary-light)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </header>
    );
}
