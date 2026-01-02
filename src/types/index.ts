// User & Account Types
export interface User {
    id: string;
    walletAddress: string;
    username?: string;
    email?: string;
    status: 'free' | 'basic' | 'pro';
    createdAt: Date;
    activatedAt?: Date;
    referralCode: string;
    referredBy?: string;
    totalDeposits: number;
    totalVolume: number;
    rank: number;
}

export interface Balances {
    frozen: number;
    basic: number;
    pro: number;
    cash: number;
}

export interface Wallet {
    address: string;
    network: 'BEP20';
    isConnected: boolean;
    balance?: number;
}

// Game Types
export interface Game {
    id: string;
    userId: string;
    type: 'basic' | 'pro';
    entryAmount: number;
    selectedNumber: number;
    winningNumber?: number;
    result?: 'win' | 'loss';
    payout?: number;
    createdAt: Date;
    completedAt?: Date;
}

export interface GameSession {
    currentGame?: Game;
    selectedNumber?: number;
    entryAmount: number;
    isPlaying: boolean;
}

export interface Payout {
    id: string;
    gameId: string;
    userId: string;
    totalAmount: number;
    dailyAmount: number;
    paidDays: number;
    totalDays: number; // Always 10
    nextPayoutAt: Date;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: Date;
}

// Referral Types
export interface Referral {
    id: string;
    userId: string;
    referredUserId: string;
    level: number; // 1-10
    status: 'pending' | 'activated' | 'pro';
    commission: number;
    createdAt: Date;
}

export interface ReferralTree {
    level1: Referral[];
    level2: Referral[];
    level3to10: Referral[];
    totalReferrals: number;
    totalCommissions: number;
}

export interface ReferralIncome {
    level: number;
    type: 'direct' | 'team';
    percentage: number;
    earnings: number;
}

// Rank & Royalty Types
export interface Rank {
    level: number;
    name: string;
    dailyPoolShare: number;
    matchingVolumeRequired: number;
    achieved: boolean;
    achievedAt?: Date;
}

export interface RoyaltyIncome {
    rank: number;
    dailyShare: number;
    totalEarned: number;
    lastPayout?: Date;
}

// Cashback Types
export interface CashbackStatus {
    isActive: boolean;
    totalLosses: number;
    recoveredAmount: number;
    dailyRate: number; // 0.5% - 2%
    maxROI: number; // 100% or 200%
    qualifyingReferrals: number;
}

// Transaction Types
export interface Transaction {
    id: string;
    userId: string;
    type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss' | 'referral' | 'cashback' | 'royalty';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    txHash?: string;
    createdAt: Date;
}

// Admin Types
export interface AdminUser {
    id: string;
    role: 'super' | 'normal';
    email: string;
    createdAt: Date;
}

export interface MasterWallet {
    address: string;
    balance: number;
    dailyDistribution: number;
}

export interface BDWallet {
    id: number;
    address: string;
    balance: number;
    lastDistribution?: Date;
}

export interface PromoterWallet {
    id: string;
    address: string;
    balance: number;
    directDepositShare: number;
    personalTreeVolume: number;
}

// Constants
export const RANK_LEVELS: Rank[] = [
    { level: 1, name: 'Bronze', dailyPoolShare: 1.0, matchingVolumeRequired: 10000, achieved: false },
    { level: 2, name: 'Silver', dailyPoolShare: 1.0, matchingVolumeRequired: 50000, achieved: false },
    { level: 3, name: 'Gold', dailyPoolShare: 1.0, matchingVolumeRequired: 100000, achieved: false },
    { level: 4, name: 'Platinum', dailyPoolShare: 1.0, matchingVolumeRequired: 500000, achieved: false },
    { level: 5, name: 'Diamond', dailyPoolShare: 0.5, matchingVolumeRequired: 1000000, achieved: false },
    { level: 6, name: 'Crown', dailyPoolShare: 0.5, matchingVolumeRequired: 5000000, achieved: false },
    { level: 7, name: 'Royal', dailyPoolShare: 1.0, matchingVolumeRequired: 10000000, achieved: false },
    { level: 8, name: 'Legend', dailyPoolShare: 1.0, matchingVolumeRequired: 50000000, achieved: false },
];

export const REFERRAL_RATES = {
    level1: 10, // 10%
    level2: 2,  // 2%
    level3to10: 1, // 1% each
};

export const CASHBACK_TIERS = [
    { minReferrals: 0, dailyRate: 0.5, maxROI: 100 },
    { minReferrals: 1, dailyRate: 1.0, maxROI: 100 },
    { minReferrals: 5, dailyRate: 1.0, maxROI: 200 },
    { minReferrals: 9, dailyRate: 2.0, maxROI: 200 },
];

export const GAME_CONFIG = {
    basicActivationAmount: 10,
    proActivationVolume: 100,
    maxPlayVolume: 1000,
    winMultiplier: 8,
    payoutDays: 10,
    freeIDExpiryDays: 10,
    signupBonus: 10,
    frozenReferralLimit: 10,
};
