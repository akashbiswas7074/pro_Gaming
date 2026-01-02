import { ethers } from 'ethers';
import {
    getProvider,
    getUSDTContract,
    parseUSDT,
    formatUSDT,
    getNetworkConfig,
    getBscScanLink,
    isValidAddress
} from './blockchain';

// Master wallet address (should be set in env)
const MASTER_WALLET = process.env.MASTER_WALLET_ADDRESS || '';
const MASTER_PRIVATE_KEY = process.env.MASTER_WALLET_PRIVATE_KEY || '';

export interface TransferResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

export interface WalletBalance {
    bnb: string;
    usdt: string;
}

/**
 * Get wallet balance (BNB + USDT)
 */
export async function getWalletBalance(address: string): Promise<WalletBalance> {
    try {
        const provider = getProvider();
        const usdtContract = getUSDTContract(provider);

        const [bnbBalance, usdtBalance] = await Promise.all([
            provider.getBalance(address),
            usdtContract.balanceOf(address),
        ]);

        return {
            bnb: ethers.utils.formatEther(bnbBalance),
            usdt: formatUSDT(usdtBalance),
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return { bnb: '0', usdt: '0' };
    }
}

/**
 * Transfer USDT from master wallet to user
 */
export async function transferUSDT(
    toAddress: string,
    amount: string
): Promise<TransferResult> {
    try {
        if (!MASTER_PRIVATE_KEY) {
            throw new Error('Master wallet private key not configured');
        }

        if (!isValidAddress(toAddress)) {
            throw new Error('Invalid recipient address');
        }

        const provider = getProvider();
        const wallet = new ethers.Wallet(MASTER_PRIVATE_KEY, provider);
        const usdtContract = getUSDTContract(wallet);

        const amountWei = parseUSDT(amount);

        // Check master wallet USDT balance
        const balance = await usdtContract.balanceOf(wallet.address);
        if (balance.lt(amountWei)) {
            throw new Error('Insufficient USDT balance in master wallet');
        }

        // Execute transfer
        const tx = await usdtContract.transfer(toAddress, amountWei);
        const receipt = await tx.wait();

        return {
            success: true,
            txHash: receipt.transactionHash,
        };
    } catch (error: any) {
        console.error('USDT transfer error:', error);
        return {
            success: false,
            error: error.message || 'Transfer failed',
        };
    }
}

/**
 * Distribute funds to BD wallets (20 wallets)
 */
export async function distributeToBDWallets(
    bdWallets: string[],
    totalAmount: string
): Promise<TransferResult[]> {
    const amountPerWallet = parseFloat(totalAmount) / bdWallets.length;
    const results: TransferResult[] = [];

    for (const wallet of bdWallets) {
        const result = await transferUSDT(wallet, amountPerWallet.toString());
        results.push(result);
    }

    return results;
}

/**
 * Check if transaction is confirmed
 */
export async function isTransactionConfirmed(txHash: string): Promise<boolean> {
    try {
        const provider = getProvider();
        const receipt = await provider.getTransactionReceipt(txHash);
        return receipt !== null && receipt.confirmations > 0;
    } catch (error) {
        console.error('Error checking transaction:', error);
        return false;
    }
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(txHash: string) {
    try {
        const provider = getProvider();
        const [tx, receipt] = await Promise.all([
            provider.getTransaction(txHash),
            provider.getTransactionReceipt(txHash),
        ]);

        if (!tx) return null;

        return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: ethers.utils.formatEther(tx.value),
            gasUsed: receipt?.gasUsed.toString(),
            status: receipt?.status === 1 ? 'success' : 'failed',
            blockNumber: receipt?.blockNumber,
            explorerLink: getBscScanLink(tx.hash),
        };
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        return null;
    }
}

/**
 * Generate random winning number (1-10)
 * In production, this should use a verifiable random function (VRF)
 */
export function generateWinningNumber(): number {
    // For demo: simple random
    // In production: Use Chainlink VRF or similar
    return Math.floor(Math.random() * 10) + 1;
}

/**
 * Calculate game result
 */
export function calculateGameResult(
    selectedNumber: number,
    winningNumber: number,
    entryAmount: number,
    multiplier: number = 8
): { win: boolean; payout: number } {
    const win = selectedNumber === winningNumber;
    const payout = win ? entryAmount * multiplier : 0;
    return { win, payout };
}

/**
 * Calculate referral commission based on level
 */
export function calculateReferralCommission(
    amount: number,
    level: number
): number {
    const rates: Record<number, number> = {
        1: 0.10,  // 10%
        2: 0.02,  // 2%
        3: 0.01,  // 1%
        4: 0.01,
        5: 0.01,
        6: 0.01,
        7: 0.01,
        8: 0.01,
        9: 0.01,
        10: 0.01,
    };
    return amount * (rates[level] || 0);
}

/**
 * Calculate cashback rate based on referral count
 */
export function getCashbackRate(qualifiedReferrals: number): { rate: number; maxROI: number } {
    if (qualifiedReferrals >= 9) return { rate: 0.02, maxROI: 2.0 };
    if (qualifiedReferrals >= 5) return { rate: 0.01, maxROI: 2.0 };
    if (qualifiedReferrals >= 1) return { rate: 0.01, maxROI: 1.0 };
    return { rate: 0.005, maxROI: 1.0 };
}

/**
 * Calculate daily payout for 10-day distribution
 */
export function calculateDailyPayout(totalAmount: number, totalDays: number = 10): number {
    return totalAmount / totalDays;
}

/**
 * Get rank requirements and rewards
 */
export const RANK_CONFIG = [
    { rank: 1, name: 'Bronze', matchingVolume: 10000, dailyShare: 0.01 },
    { rank: 2, name: 'Silver', matchingVolume: 50000, dailyShare: 0.01 },
    { rank: 3, name: 'Gold', matchingVolume: 100000, dailyShare: 0.01 },
    { rank: 4, name: 'Platinum', matchingVolume: 500000, dailyShare: 0.01 },
    { rank: 5, name: 'Diamond', matchingVolume: 1000000, dailyShare: 0.005 },
    { rank: 6, name: 'Blue Diamond', matchingVolume: 5000000, dailyShare: 0.005 },
    { rank: 7, name: 'Crown', matchingVolume: 10000000, dailyShare: 0.01 },
    { rank: 8, name: 'Royal Crown', matchingVolume: 50000000, dailyShare: 0.01 },
];

/**
 * Calculate matching volume for rank
 */
export function calculateMatchingVolume(
    strongLegVolume: number,
    otherLegsVolume: number
): number {
    return Math.min(strongLegVolume, otherLegsVolume);
}

/**
 * Get current rank based on matching volume
 */
export function getCurrentRank(matchingVolume: number): number {
    for (let i = RANK_CONFIG.length - 1; i >= 0; i--) {
        if (matchingVolume >= RANK_CONFIG[i].matchingVolume) {
            return RANK_CONFIG[i].rank;
        }
    }
    return 0;
}
