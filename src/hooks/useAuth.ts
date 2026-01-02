'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface UseAuthReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: {
        userId: string;
        walletAddress: string;
        referralCode: string;
    } | null;
    connectWallet: (referralCode?: string) => Promise<void>;
    disconnect: () => Promise<void>;
    error: string | null;
}

export function useAuth(): UseAuthReturn {
    const { data: session, status } = useSession();
    const [error, setError] = useState<string | null>(null);

    const connectWallet = useCallback(async (referralCode?: string) => {
        try {
            setError(null);

            // Check if MetaMask is available
            if (typeof window === 'undefined' || !window.ethereum) {
                throw new Error('Please install MetaMask or another Web3 wallet');
            }

            // Request account access
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Check network (BSC)
            const network = await provider.getNetwork();
            if (network.chainId !== 56 && network.chainId !== 97) {
                // Try to switch to BSC
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }], // BSC Mainnet
                    });
                } catch (switchError: any) {
                    // Chain not added, try to add it
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x38',
                                chainName: 'BNB Smart Chain',
                                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                                rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                                blockExplorerUrls: ['https://bscscan.com/'],
                            }],
                        });
                    }
                }
            }

            // Create message to sign
            const timestamp = Date.now();
            const message = `Sign this message to authenticate with Pro Game Ecosystem.\n\nWallet: ${address}\nTimestamp: ${timestamp}`;

            // Request signature
            const signature = await signer.signMessage(message);

            // Sign in with NextAuth
            const result = await signIn('web3', {
                address,
                message,
                signature,
                referralCode: referralCode || '',
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

        } catch (err: any) {
            console.error('Wallet connection error:', err);
            setError(err.message || 'Failed to connect wallet');
            throw err;
        }
    }, []);

    const disconnect = useCallback(async () => {
        await signOut({ redirect: false });
    }, []);

    return {
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        user: session?.user ? {
            userId: (session.user as any).userId || '',
            walletAddress: (session.user as any).walletAddress || session.user.email || '',
            referralCode: session.user.name || '',
        } : null,
        connectWallet,
        disconnect,
        error,
    };
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        ethereum?: any;
    }
}
