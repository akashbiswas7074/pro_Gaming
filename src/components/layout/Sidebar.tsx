'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Gamepad2,
    LayoutDashboard,
    Users,
    Trophy,
    Shield,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';

const sidebarItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'View your balances' },
    { href: '/game', label: 'Play Game', icon: Gamepad2, description: 'Lucky Number Draw' },
    { href: '/how-it-works', label: 'How It Works', icon: Sparkles, description: 'Complete guide' },
    { href: '/referrals', label: 'Referrals', icon: Users, description: '10-level network' },
    { href: '/compensation', label: 'Compensation', icon: Trophy, description: 'Income streams' },
    { href: '/admin', label: 'Admin Panel', icon: Shield, description: 'Manage platform' },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, balances } = useUserStore();

    return (
        <aside
            className={`fixed left-0 top-16 bottom-0 z-40 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300 hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Quick Balance */}
                {!isCollapsed && user && (
                    <div className="p-4 border-b border-[var(--border-color)]">
                        <div className="glass-card p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                                <span className="text-xs text-[var(--text-muted)]">Quick Balance</span>
                            </div>
                            <div className="text-lg font-bold gradient-gold-text">
                                ${(balances.cash + balances.pro).toFixed(2)}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">Available</div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive
                                    ? 'bg-[var(--bg-glass)] text-[var(--primary-light)] glow'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[var(--primary)]' : ''}`} />
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{item.label}</div>
                                        <div className="text-xs text-[var(--text-muted)] truncate">
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Help Link */}
                <div className="p-4 border-t border-[var(--border-color)]">
                    <Link
                        href="/faq"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all`}
                    >
                        <HelpCircle className="w-5 h-5" />
                        {!isCollapsed && <span className="text-sm">Help & FAQ</span>}
                    </Link>
                </div>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--primary)] hover:border-[var(--primary)] transition-all"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>
        </aside>
    );
}
