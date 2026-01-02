'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Trophy,
    Zap,
    AlertTriangle,
    CheckCircle,
    X,
    Coins,
    Star,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/types';

export default function GamePage() {
    const router = useRouter();
    const { user, balances, updateBalances, updateCashbackStatus } = useUserStore();
    const {
        currentSession,
        setSelectedNumber,
        setEntryAmount,
        playGame,
        lastResult,
        clearLastResult,
        isProcessing,
        gameHistory
    } = useGameStore();

    const [gameType, setGameType] = useState<'basic' | 'pro'>('basic');
    const [showResult, setShowResult] = useState(false);
    const [animatingNumber, setAnimatingNumber] = useState<number | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            router.push('/register');
        }
    }, [user, router]);

    // Show result modal when game ends
    useEffect(() => {
        if (lastResult) {
            setAnimatingNumber(lastResult.number);
            setTimeout(() => {
                setShowResult(true);
            }, 1500);
        }
    }, [lastResult]);

    if (!user) return null;

    const availableBalance = gameType === 'basic' ? balances.basic : balances.pro;
    const canPlay = availableBalance >= currentSession.entryAmount && currentSession.selectedNumber !== undefined;

    const handlePlay = () => {
        if (!canPlay || !user || isProcessing) return;

        try {
            const result = playGame(user.id, gameType);

            // Update balances based on result
            if (result.result === 'win') {
                const newBalance = gameType === 'basic'
                    ? { basic: balances.basic - currentSession.entryAmount + (result.payout || 0) }
                    : { pro: balances.pro - currentSession.entryAmount + (result.payout || 0) };
                updateBalances(newBalance);
            } else {
                const newBalance = gameType === 'basic'
                    ? { basic: balances.basic - currentSession.entryAmount }
                    : { pro: balances.pro - currentSession.entryAmount };
                updateBalances(newBalance);

                // Update cashback losses if in Pro mode
                if (gameType === 'pro') {
                    updateCashbackStatus({
                        totalLosses: (balances.pro >= 0 ? currentSession.entryAmount : 0)
                    });
                }
            }
        } catch (error) {
            console.error('Game error:', error);
        }
    };

    const closeResult = () => {
        setShowResult(false);
        setAnimatingNumber(null);
        clearLastResult();
    };

    const stats = {
        gamesPlayed: gameHistory.length,
        wins: gameHistory.filter(g => g.result === 'win').length,
        losses: gameHistory.filter(g => g.result === 'loss').length,
        totalWon: gameHistory.filter(g => g.result === 'win').reduce((sum, g) => sum + (g.payout || 0), 0),
    };

    return (
        <DashboardLayout>
            <div className="container py-8">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title flex items-center gap-3">
                        <Gamepad2 className="w-8 h-8 text-[var(--primary)]" />
                        Lucky Number Draw
                    </h1>
                    <p className="page-subtitle">
                        Pick a number from 1-10. Match the winning number and win 8X your entry!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Game Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Game Type Toggle */}
                        <div className="card">
                            <div className="flex rounded-lg bg-[var(--bg-tertiary)] p-1">
                                <button
                                    onClick={() => setGameType('basic')}
                                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${gameType === 'basic'
                                            ? 'bg-[var(--primary)] text-white shadow-lg'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <Gamepad2 className="w-5 h-5" />
                                    Basic Game
                                </button>
                                <button
                                    onClick={() => setGameType('pro')}
                                    disabled={user.status !== 'pro'}
                                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${gameType === 'pro'
                                            ? 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-[#0a0a0f] shadow-lg'
                                            : user.status !== 'pro'
                                                ? 'text-[var(--text-muted)] cursor-not-allowed'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <Trophy className="w-5 h-5" />
                                    Pro Game
                                    {user.status !== 'pro' && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--warning)]/20 text-[var(--warning)]">
                                            Locked
                                        </span>
                                    )}
                                </button>
                            </div>

                            {gameType === 'basic' ? (
                                <div className="mt-4 p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            <strong className="text-[var(--warning)]">Training Mode:</strong> Basic Game winnings
                                            are locked and cannot be withdrawn. Upgrade to Pro to unlock real cash outs.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-[var(--text-secondary)]">
                                            <strong className="text-[var(--success)]">Real Cash Mode:</strong> Winnings are paid
                                            automatically to your wallet in 10 daily distributions.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Number Selection */}
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">Pick Your Lucky Number</h2>
                            <div className="grid grid-cols-5 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <motion.button
                                        key={num}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedNumber(num)}
                                        disabled={isProcessing}
                                        className={`game-number ${currentSession.selectedNumber === num ? 'selected' : ''
                                            } ${animatingNumber === num ? 'winning' : ''}`}
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Entry Amount */}
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">Entry Amount</h2>
                            <div className="flex flex-wrap gap-3 mb-4">
                                {[10, 25, 50, 100, 250, 500].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setEntryAmount(amount)}
                                        disabled={amount > availableBalance}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentSession.entryAmount === amount
                                                ? 'bg-[var(--primary)] text-white'
                                                : amount > availableBalance
                                                    ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                                            }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="input-group flex-1">
                                    <label className="input-label">Custom Amount</label>
                                    <input
                                        type="number"
                                        value={currentSession.entryAmount}
                                        onChange={(e) => setEntryAmount(Number(e.target.value))}
                                        min={1}
                                        max={Math.min(availableBalance, GAME_CONFIG.maxPlayVolume)}
                                        className="input"
                                    />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-[var(--text-muted)]">Available</div>
                                    <div className="text-xl font-bold">${availableBalance.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Play Button */}
                        <motion.button
                            whileHover={{ scale: canPlay ? 1.02 : 1 }}
                            whileTap={{ scale: canPlay ? 0.98 : 1 }}
                            onClick={handlePlay}
                            disabled={!canPlay || isProcessing}
                            className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${canPlay && !isProcessing
                                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white pulse-glow cursor-pointer'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                    Drawing Number...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6" />
                                    Play for ${currentSession.entryAmount} - Win ${currentSession.entryAmount * GAME_CONFIG.winMultiplier}
                                </>
                            )}
                        </motion.button>

                        {!canPlay && currentSession.selectedNumber === undefined && (
                            <p className="text-center text-sm text-[var(--text-muted)]">
                                Select a number to play
                            </p>
                        )}
                    </div>

                    {/* Sidebar - Stats & Info */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">Your Stats</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Games Played</span>
                                    <span className="font-bold">{stats.gamesPlayed}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Wins</span>
                                    <span className="font-bold text-[var(--success)]">{stats.wins}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Losses</span>
                                    <span className="font-bold text-[var(--danger)]">{stats.losses}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Win Rate</span>
                                    <span className="font-bold">
                                        {stats.gamesPlayed > 0
                                            ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
                                            : 0}%
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Total Won</span>
                                        <span className="font-bold gradient-gold-text text-lg">
                                            ${stats.totalWon.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">How It Works</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        1
                                    </div>
                                    <span className="text-[var(--text-secondary)]">
                                        Pick any number from 1-10
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        2
                                    </div>
                                    <span className="text-[var(--text-secondary)]">
                                        Set your entry amount (min $1, max $1,000)
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        3
                                    </div>
                                    <span className="text-[var(--text-secondary)]">
                                        System generates a random winning number
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[var(--success)]/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[var(--success)]">
                                        ✓
                                    </div>
                                    <span className="text-[var(--text-secondary)]">
                                        Match = Win <span className="text-[var(--success)] font-bold">8X</span> your entry!
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Win Multiplier Display */}
                        <div className="card text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/20 mb-3">
                                <Star className="w-4 h-4 text-[var(--accent)]" />
                                <span className="text-sm font-medium text-[var(--accent)]">Win Multiplier</span>
                            </div>
                            <div className="text-5xl font-bold gradient-gold-text mb-2">8X</div>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Your potential win: <span className="font-bold text-white">
                                    ${(currentSession.entryAmount * GAME_CONFIG.winMultiplier).toFixed(2)}
                                </span>
                            </p>
                        </div>

                        {/* Odds Display */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[var(--text-secondary)]">Your Odds</span>
                                <span className="font-bold text-[var(--primary-light)]">1 in 10</span>
                            </div>
                            <div className="progress">
                                <div className="progress-bar" style={{ width: '10%' }} />
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-2">
                                10% chance to win on every draw
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <AnimatePresence>
                {showResult && lastResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeResult}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`glass-card p-8 max-w-md w-full text-center relative ${lastResult.type === 'win' ? 'glow-gold' : ''
                                }`}
                        >
                            <button
                                onClick={closeResult}
                                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {lastResult.type === 'win' ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className="inline-block mb-4"
                                    >
                                        <Trophy className="w-20 h-20 text-[var(--accent)]" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold gradient-gold-text mb-2">
                                        YOU WON! 🎉
                                    </h2>
                                    <div className="text-5xl font-bold text-[var(--success)] mb-4">
                                        +${lastResult.amount.toFixed(2)}
                                    </div>
                                    <p className="text-[var(--text-secondary)] mb-6">
                                        The winning number was <span className="font-bold text-white">{lastResult.number}</span>
                                    </p>
                                    {gameType === 'pro' && (
                                        <div className="p-4 rounded-lg bg-[var(--success)]/10 border border-[var(--success)]/30 text-sm">
                                            <CheckCircle className="w-5 h-5 text-[var(--success)] inline mr-2" />
                                            Winnings will be distributed in 10 daily payouts
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <Gamepad2 className="w-20 h-20 text-[var(--text-muted)] mx-auto" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Not This Time</h2>
                                    <div className="text-2xl font-bold text-[var(--danger)] mb-4">
                                        -${lastResult.amount.toFixed(2)}
                                    </div>
                                    <p className="text-[var(--text-secondary)] mb-6">
                                        The winning number was <span className="font-bold text-white">{lastResult.number}</span>
                                    </p>
                                    {gameType === 'pro' && (
                                        <div className="p-4 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-sm">
                                            <Sparkles className="w-5 h-5 text-[var(--primary)] inline mr-2" />
                                            Remember: Cashback protection activates at $100 total losses
                                        </div>
                                    )}
                                </>
                            )}

                            <button
                                onClick={closeResult}
                                className="btn btn-primary btn-lg w-full mt-6"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
