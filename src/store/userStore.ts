import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Balances, Wallet, CashbackStatus, ReferralTree, Rank, RANK_LEVELS, GAME_CONFIG, CASHBACK_TIERS } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
    user: User | null;
    balances: Balances;
    wallet: Wallet | null;
    cashbackStatus: CashbackStatus;
    referralTree: ReferralTree;
    ranks: Rank[];
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    updateBalances: (balances: Partial<Balances>) => void;
    connectWallet: (address: string) => void;
    disconnectWallet: () => void;
    register: (walletAddress: string, referralCode?: string) => void;
    activateBasic: (depositAmount: number) => void;
    activatePro: () => void;
    updateCashbackStatus: (status: Partial<CashbackStatus>) => void;
    addReferral: (referredUserId: string, level: number) => void;
    checkRankAchievement: () => void;
    resetUser: () => void;
}

const initialBalances: Balances = {
    frozen: 0,
    basic: 0,
    pro: 0,
    cash: 0,
};

const initialCashbackStatus: CashbackStatus = {
    isActive: false,
    totalLosses: 0,
    recoveredAmount: 0,
    dailyRate: 0.5,
    maxROI: 100,
    qualifyingReferrals: 0,
};

const initialReferralTree: ReferralTree = {
    level1: [],
    level2: [],
    level3to10: [],
    totalReferrals: 0,
    totalCommissions: 0,
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            balances: initialBalances,
            wallet: null,
            cashbackStatus: initialCashbackStatus,
            referralTree: initialReferralTree,
            ranks: RANK_LEVELS,
            isLoading: false,

            setUser: (user) => set({ user }),

            updateBalances: (newBalances) =>
                set((state) => ({
                    balances: { ...state.balances, ...newBalances }
                })),

            connectWallet: (address) =>
                set({
                    wallet: {
                        address,
                        network: 'BEP20',
                        isConnected: true,
                    }
                }),

            disconnectWallet: () => set({ wallet: null }),

            register: (walletAddress, referralCode) => {
                const newUser: User = {
                    id: uuidv4(),
                    walletAddress,
                    status: 'free',
                    createdAt: new Date(),
                    referralCode: uuidv4().slice(0, 8).toUpperCase(),
                    referredBy: referralCode,
                    totalDeposits: 0,
                    totalVolume: 0,
                    rank: 0,
                };

                set({
                    user: newUser,
                    balances: {
                        frozen: GAME_CONFIG.signupBonus, // 10 USDT signup bonus
                        basic: 0,
                        pro: 0,
                        cash: 0,
                    },
                    wallet: {
                        address: walletAddress,
                        network: 'BEP20',
                        isConnected: true,
                    }
                });
            },

            activateBasic: (depositAmount) => {
                const state = get();
                if (!state.user || depositAmount < GAME_CONFIG.basicActivationAmount) return;

                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        status: 'basic',
                        activatedAt: new Date(),
                        totalDeposits: state.user.totalDeposits + depositAmount,
                    } : null,
                    balances: {
                        ...state.balances,
                        frozen: 0,
                        basic: state.balances.frozen + depositAmount,
                        cash: depositAmount,
                    }
                }));
            },

            activatePro: () => {
                const state = get();
                if (!state.user || state.user.totalVolume < GAME_CONFIG.proActivationVolume) return;

                set((state) => ({
                    user: state.user ? {
                        ...state.user,
                        status: 'pro',
                    } : null,
                    balances: {
                        ...state.balances,
                        pro: state.balances.basic,
                        basic: 0,
                    }
                }));
            },

            updateCashbackStatus: (status) => {
                set((state) => {
                    const newStatus = { ...state.cashbackStatus, ...status };

                    // Calculate tier based on referrals
                    const tier = CASHBACK_TIERS.reduce((acc, t) =>
                        newStatus.qualifyingReferrals >= t.minReferrals ? t : acc
                        , CASHBACK_TIERS[0]);

                    newStatus.dailyRate = tier.dailyRate;
                    newStatus.maxROI = tier.maxROI;

                    // Activate cashback if losses >= 100
                    if (newStatus.totalLosses >= 100 && !newStatus.isActive) {
                        newStatus.isActive = true;
                    }

                    return { cashbackStatus: newStatus };
                });
            },

            addReferral: (referredUserId, level) => {
                set((state) => {
                    const newReferral = {
                        id: uuidv4(),
                        userId: state.user?.id || '',
                        referredUserId,
                        level,
                        status: 'pending' as const,
                        commission: 0,
                        createdAt: new Date(),
                    };

                    const tree = { ...state.referralTree };

                    if (level === 1) {
                        tree.level1 = [...tree.level1, newReferral];
                    } else if (level === 2) {
                        tree.level2 = [...tree.level2, newReferral];
                    } else {
                        tree.level3to10 = [...tree.level3to10, newReferral];
                    }

                    tree.totalReferrals = tree.level1.length + tree.level2.length + tree.level3to10.length;

                    return { referralTree: tree };
                });
            },

            checkRankAchievement: () => {
                set((state) => {
                    if (!state.user) return state;

                    const matchingVolume = state.user.totalVolume;
                    const updatedRanks = state.ranks.map((rank) => ({
                        ...rank,
                        achieved: matchingVolume >= rank.matchingVolumeRequired,
                        achievedAt: matchingVolume >= rank.matchingVolumeRequired && !rank.achieved
                            ? new Date()
                            : rank.achievedAt,
                    }));

                    const highestRank = updatedRanks.filter(r => r.achieved).length;

                    return {
                        ranks: updatedRanks,
                        user: { ...state.user, rank: highestRank }
                    };
                });
            },

            resetUser: () => set({
                user: null,
                balances: initialBalances,
                wallet: null,
                cashbackStatus: initialCashbackStatus,
                referralTree: initialReferralTree,
                ranks: RANK_LEVELS,
            }),
        }),
        {
            name: 'pro-game-user',
        }
    )
);
