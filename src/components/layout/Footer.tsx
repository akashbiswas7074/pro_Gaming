'use client';

import Link from 'next/link';
import {
    Twitter,
    MessageCircle,
    Github,
    Mail,
    Shield,
    ExternalLink
} from 'lucide-react';

const footerLinks = {
    platform: [
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Game Rules', href: '/rules' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Compensation Plan', href: '/compensation' },
    ],
    resources: [
        { label: 'Smart Contract', href: '#', external: true },
        { label: 'Whitepaper', href: '#', external: true },
        { label: 'API Docs', href: '#', external: true },
        { label: 'Brand Kit', href: '#', external: true },
    ],
    legal: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Disclaimer', href: '/disclaimer' },
    ],
};

const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'Telegram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-auto">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'var(--gradient-primary)' }}
                            >
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">Pro Game</span>
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mb-4 max-w-sm">
                            A transparent, decentralized gaming platform on the BEP20 Blockchain.
                            Play smart, win big, zero risk with our unique cashback protection.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all"
                                        title={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4">Platform</h4>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.external && <ExternalLink className="w-3 h-3" />}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--text-muted)]">
                        © 2024 Pro Game Ecosystem. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                            All Systems Operational
                        </span>
                        <span>•</span>
                        <span>Network: BEP20</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
