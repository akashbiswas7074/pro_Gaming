import { create } from 'zustand';
import { Game, GameSession, Payout, Transaction, GAME_CONFIG } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface GameState {
    currentSession: GameSession;
    gameHistory: Game[];
    activePayout: Payout[];
    transactions: Transaction[];
    isProcessing: boolean;
    lastResult: { type: 'win' | 'loss'; amount: number; number: number } | null;

    // Actions
    setSelectedNumber: (number: number) => void;
    setEntryAmount: (amount: number) => void;
    playGame: (userId: string, type: 'basic' | 'pro') => Game;
    addPayout: (payout: Payout) => void;
    processPayoutDay: (payoutId: string) => void;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
    clearLastResult: () => void;
    resetGame: () => void;
}

const initialSession: GameSession = {
    currentGame: undefined,
    selectedNumber: undefined,
    entryAmount: 10,
    isPlaying: false,
};

// Generate random winning number (1-10)
const generateWinningNumber = (): number => {
    return Math.floor(Math.random() * 10) + 1;
};

export const useGameStore = create<GameState>()((set, get) => ({
    currentSession: initialSession,
    gameHistory: [],
    activePayout: [],
    transactions: [],
    isProcessing: false,
    lastResult: null,

    setSelectedNumber: (number) =>
        set((state) => ({
            currentSession: { ...state.currentSession, selectedNumber: number }
        })),

    setEntryAmount: (amount) =>
        set((state) => ({
            currentSession: {
                ...state.currentSession,
                entryAmount: Math.min(amount, GAME_CONFIG.maxPlayVolume)
            }
        })),

    playGame: (userId, type) => {
        const state = get();
        const { selectedNumber, entryAmount } = state.currentSession;

        if (selectedNumber === undefined) {
            throw new Error('Please select a number');
        }

        set({ isProcessing: true });

        const winningNumber = generateWinningNumber();
        const isWin = selectedNumber === winningNumber;
        const payout = isWin ? entryAmount * GAME_CONFIG.winMultiplier : 0;

        const game: Game = {
            id: uuidv4(),
            userId,
            type,
            entryAmount,
            selectedNumber,
            winningNumber,
            result: isWin ? 'win' : 'loss',
            payout,
            createdAt: new Date(),
            completedAt: new Date(),
        };

        // If win in Pro mode, create payout schedule
        if (isWin && type === 'pro') {
            const payoutSchedule: Payout = {
                id: uuidv4(),
                gameId: game.id,
                userId,
                totalAmount: payout,
                dailyAmount: payout / GAME_CONFIG.payoutDays,
                paidDays: 0,
                totalDays: GAME_CONFIG.payoutDays,
                nextPayoutAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
                status: 'pending',
                createdAt: new Date(),
            };

            set((state) => ({
                activePayout: [...state.activePayout, payoutSchedule]
            }));
        }

        // Add transaction
        const transactionType = isWin ? 'game_win' : 'game_loss';
        get().addTransaction({
            userId,
            type: transactionType,
            amount: isWin ? payout : -entryAmount,
            status: 'completed',
        });

        set((state) => ({
            gameHistory: [game, ...state.gameHistory],
            currentSession: {
                ...state.currentSession,
                currentGame: game,
                isPlaying: false,
                selectedNumber: undefined,
            },
            isProcessing: false,
            lastResult: {
                type: isWin ? 'win' : 'loss',
                amount: isWin ? payout : entryAmount,
                number: winningNumber,
            },
        }));

        return game;
    },

    addPayout: (payout) =>
        set((state) => ({
            activePayout: [...state.activePayout, payout]
        })),

    processPayoutDay: (payoutId) => {
        set((state) => {
            const payout = state.activePayout.find(p => p.id === payoutId);
            if (!payout) return state;

            const updatedPayout = {
                ...payout,
                paidDays: payout.paidDays + 1,
                nextPayoutAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                status: payout.paidDays + 1 >= payout.totalDays ? 'completed' as const : 'in_progress' as const,
            };

            return {
                activePayout: state.activePayout.map(p =>
                    p.id === payoutId ? updatedPayout : p
                ),
            };
        });
    },

    addTransaction: (transaction) =>
        set((state) => ({
            transactions: [{
                ...transaction,
                id: uuidv4(),
                createdAt: new Date(),
            }, ...state.transactions]
        })),

    clearLastResult: () => set({ lastResult: null }),

    resetGame: () => set({
        currentSession: initialSession,
        gameHistory: [],
        activePayout: [],
        transactions: [],
        isProcessing: false,
        lastResult: null,
    }),
}));
