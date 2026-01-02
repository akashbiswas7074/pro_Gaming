import mongoose, { Schema, Document, Model } from 'mongoose';

// ===== USER MODEL =====
export interface IUser extends Document {
    walletAddress: string;
    referralCode: string;
    referredBy?: string;
    status: 'free' | 'basic' | 'pro';
    totalVolume: number;
    totalDeposits: number;
    directReferrals: number;
    registeredAt: Date;
    activatedAt?: Date;
    proActivatedAt?: Date;
    expiresAt?: Date;
    isActive: boolean;
}

const UserSchema = new Schema<IUser>({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    referredBy: {
        type: String,
        index: true
    },
    status: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free'
    },
    totalVolume: { type: Number, default: 0 },
    totalDeposits: { type: Number, default: 0 },
    directReferrals: { type: Number, default: 0 },
    registeredAt: { type: Date, default: Date.now },
    activatedAt: { type: Date },
    proActivatedAt: { type: Date },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Auto set expiry for free accounts (10 days)
UserSchema.pre('save', function (next) {
    if (this.isNew && this.status === 'free') {
        this.expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    }
    next();
});

// ===== BALANCE MODEL =====
export interface IBalance extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    frozen: number;
    basic: number;
    pro: number;
    cash: number;
}

const BalanceSchema = new Schema<IBalance>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    walletAddress: { type: String, required: true, index: true },
    frozen: { type: Number, default: 10 }, // Initial 10 USDT signup bonus
    basic: { type: Number, default: 0 },
    pro: { type: Number, default: 0 },
    cash: { type: Number, default: 0 }
}, { timestamps: true });

// ===== GAME SESSION MODEL =====
export interface IGameSession extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    gameType: 'basic' | 'pro';
    entryAmount: number;
    selectedNumber: number;
    winningNumber: number;
    result: 'win' | 'loss';
    payout: number;
    txHash?: string;
    playedAt: Date;
}

const GameSessionSchema = new Schema<IGameSession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    gameType: { type: String, enum: ['basic', 'pro'], required: true },
    entryAmount: { type: Number, required: true },
    selectedNumber: { type: Number, required: true, min: 1, max: 10 },
    winningNumber: { type: Number, required: true, min: 1, max: 10 },
    result: { type: String, enum: ['win', 'loss'], required: true },
    payout: { type: Number, default: 0 },
    txHash: { type: String },
    playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ===== TRANSACTION MODEL =====
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    type: 'deposit' | 'withdrawal' | 'game_entry' | 'game_win' | 'referral' | 'royalty' | 'cashback';
    amount: number;
    fromBalance?: 'frozen' | 'basic' | 'pro' | 'cash';
    toBalance?: 'frozen' | 'basic' | 'pro' | 'cash';
    txHash?: string;
    status: 'pending' | 'completed' | 'failed';
    description?: string;
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'game_entry', 'game_win', 'referral', 'royalty', 'cashback'],
        required: true
    },
    amount: { type: Number, required: true },
    fromBalance: { type: String, enum: ['frozen', 'basic', 'pro', 'cash'] },
    toBalance: { type: String, enum: ['frozen', 'basic', 'pro', 'cash'] },
    txHash: { type: String, index: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ===== REFERRAL MODEL =====
export interface IReferral extends Document {
    referrerId: mongoose.Types.ObjectId;
    referredId: mongoose.Types.ObjectId;
    level: number;
    status: 'pending' | 'activated' | 'pro';
    commission: number;
    createdAt: Date;
}

const ReferralSchema = new Schema<IReferral>({
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referredId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    level: { type: Number, required: true, min: 1, max: 10 },
    status: { type: String, enum: ['pending', 'activated', 'pro'], default: 'pending' },
    commission: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ===== PAYOUT SCHEDULE MODEL =====
export interface IPayoutSchedule extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    gameSessionId: mongoose.Types.ObjectId;
    totalAmount: number;
    dailyAmount: number;
    paidDays: number;
    totalDays: number;
    nextPayoutDate: Date;
    status: 'active' | 'completed' | 'cancelled';
    createdAt: Date;
}

const PayoutScheduleSchema = new Schema<IPayoutSchedule>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    gameSessionId: { type: Schema.Types.ObjectId, ref: 'GameSession', required: true },
    totalAmount: { type: Number, required: true },
    dailyAmount: { type: Number, required: true },
    paidDays: { type: Number, default: 0 },
    totalDays: { type: Number, default: 10 },
    nextPayoutDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ===== CASHBACK STATUS MODEL =====
export interface ICashbackStatus extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    totalLosses: number;
    totalRecovered: number;
    dailyRate: number;
    maxRecovery: number;
    isActive: boolean;
    qualifiedReferrals: number;
    lastPayoutDate?: Date;
}

const CashbackStatusSchema = new Schema<ICashbackStatus>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    walletAddress: { type: String, required: true, index: true },
    totalLosses: { type: Number, default: 0 },
    totalRecovered: { type: Number, default: 0 },
    dailyRate: { type: Number, default: 0.5 },
    maxRecovery: { type: Number, default: 100 },
    isActive: { type: Boolean, default: false },
    qualifiedReferrals: { type: Number, default: 0 },
    lastPayoutDate: { type: Date }
}, { timestamps: true });

// ===== RANK MODEL =====
export interface IRank extends Document {
    userId: mongoose.Types.ObjectId;
    walletAddress: string;
    currentRank: number;
    matchingVolume: number;
    strongLegVolume: number;
    otherLegsVolume: number;
    royaltyEarned: number;
    achievedAt?: Date;
}

const RankSchema = new Schema<IRank>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    walletAddress: { type: String, required: true, index: true },
    currentRank: { type: Number, default: 0 },
    matchingVolume: { type: Number, default: 0 },
    strongLegVolume: { type: Number, default: 0 },
    otherLegsVolume: { type: Number, default: 0 },
    royaltyEarned: { type: Number, default: 0 },
    achievedAt: { type: Date }
}, { timestamps: true });

// ===== WALLET MODEL (Admin) =====
export interface IWallet extends Document {
    type: 'master' | 'bd' | 'promoter' | 'creator';
    address: string;
    balance: number;
    label?: string;
    isActive: boolean;
    lastDistribution?: Date;
    personalTreeVolume?: number;
}

const WalletSchema = new Schema<IWallet>({
    type: { type: String, enum: ['master', 'bd', 'promoter', 'creator'], required: true },
    address: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0 },
    label: { type: String },
    isActive: { type: Boolean, default: true },
    lastDistribution: { type: Date },
    personalTreeVolume: { type: Number, default: 0 }
}, { timestamps: true });

// ===== SYSTEM STATS MODEL =====
export interface ISystemStats extends Document {
    date: Date;
    totalDeposits: number;
    totalWithdrawals: number;
    totalGamesPlayed: number;
    totalPayouts: number;
    masterWalletBalance: number;
    activeUsers: number;
}

const SystemStatsSchema = new Schema<ISystemStats>({
    date: { type: Date, required: true, unique: true },
    totalDeposits: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    totalGamesPlayed: { type: Number, default: 0 },
    totalPayouts: { type: Number, default: 0 },
    masterWalletBalance: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 }
}, { timestamps: true });

// Export models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Balance: Model<IBalance> = mongoose.models.Balance || mongoose.model<IBalance>('Balance', BalanceSchema);
export const GameSession: Model<IGameSession> = mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);
export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const Referral: Model<IReferral> = mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);
export const PayoutSchedule: Model<IPayoutSchedule> = mongoose.models.PayoutSchedule || mongoose.model<IPayoutSchedule>('PayoutSchedule', PayoutScheduleSchema);
export const CashbackStatus: Model<ICashbackStatus> = mongoose.models.CashbackStatus || mongoose.model<ICashbackStatus>('CashbackStatus', CashbackStatusSchema);
export const Rank: Model<IRank> = mongoose.models.Rank || mongoose.model<IRank>('Rank', RankSchema);
export const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
export const SystemStats: Model<ISystemStats> = mongoose.models.SystemStats || mongoose.model<ISystemStats>('SystemStats', SystemStatsSchema);
