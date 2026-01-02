import { ethers } from 'ethers';

// BEP20 Network Configuration
export const BSC_MAINNET = {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed1.binance.org/',
    explorerUrl: 'https://bscscan.com',
    symbol: 'BNB',
    decimals: 18,
};

export const BSC_TESTNET = {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorerUrl: 'https://testnet.bscscan.com',
    symbol: 'tBNB',
    decimals: 18,
};

// USDT Contract Addresses
export const USDT_ADDRESSES = {
    mainnet: '0x55d398326f99059fF775485246999027B3197955', // BSC USDT
    testnet: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet USDT
};

// Standard BEP20 ABI
export const BEP20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function transferFrom(address from, address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

// Pro Game Smart Contract ABI (to be deployed)
export const PRO_GAME_ABI = [
    // Admin functions
    'function setMasterWallet(address _wallet) external',
    'function setBDWallets(address[] calldata _wallets) external',
    'function setPromoterWallets(address[] calldata _wallets) external',
    'function setGameConfig(uint256 _multiplier, uint256 _maxPlay) external',

    // User functions
    'function register(address _referrer) external',
    'function deposit(uint256 _amount) external',
    'function playGame(uint8 _selectedNumber, uint256 _amount) external returns (uint8 winningNumber, bool win)',
    'function claimCashback() external',

    // View functions
    'function getUserBalance(address _user) external view returns (uint256 frozen, uint256 basic, uint256 pro, uint256 cash)',
    'function getReferralTree(address _user) external view returns (address[] memory)',
    'function getRank(address _user) external view returns (uint8)',
    'function getPendingPayouts(address _user) external view returns (uint256)',

    // Events
    'event UserRegistered(address indexed user, address indexed referrer, uint256 timestamp)',
    'event Deposit(address indexed user, uint256 amount, uint256 timestamp)',
    'event GamePlayed(address indexed user, uint8 selectedNumber, uint8 winningNumber, bool win, uint256 amount)',
    'event PayoutDistributed(address indexed user, uint256 amount, uint256 day)',
    'event CashbackClaimed(address indexed user, uint256 amount)',
    'event RankAchieved(address indexed user, uint8 rank)',
];

// Get network config based on environment
export function getNetworkConfig() {
    const isMainnet = process.env.NEXT_PUBLIC_BSC_NETWORK === 'mainnet';
    return isMainnet ? BSC_MAINNET : BSC_TESTNET;
}

// Get USDT address based on network
export function getUSDTAddress() {
    const isMainnet = process.env.NEXT_PUBLIC_BSC_NETWORK === 'mainnet';
    return isMainnet ? USDT_ADDRESSES.mainnet : USDT_ADDRESSES.testnet;
}

// Create provider
export function getProvider() {
    const config = getNetworkConfig();
    return new ethers.providers.JsonRpcProvider(config.rpcUrl);
}

// Create contract instance
export function getUSDTContract(signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
    const provider = signerOrProvider || getProvider();
    return new ethers.Contract(getUSDTAddress(), BEP20_ABI, provider);
}

// Format USDT amount (6 decimals on BSC)
export function formatUSDT(amount: ethers.BigNumber): string {
    return ethers.utils.formatUnits(amount, 18);
}

// Parse USDT amount
export function parseUSDT(amount: string): ethers.BigNumber {
    return ethers.utils.parseUnits(amount, 18);
}

// Validate BSC address
export function isValidAddress(address: string): boolean {
    try {
        ethers.utils.getAddress(address);
        return true;
    } catch {
        return false;
    }
}

// Truncate address for display
export function truncateAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Get BSCScan link
export function getBscScanLink(hash: string, type: 'tx' | 'address' = 'tx') {
    const config = getNetworkConfig();
    return `${config.explorerUrl}/${type}/${hash}`;
}
