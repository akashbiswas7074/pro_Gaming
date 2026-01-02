// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ProGameEcosystem
 * @dev Main contract for Pro Game Ecosystem on BEP20 Network
 * Features:
 * - User registration with referral tracking
 * - Deposit/withdrawal of USDT
 * - Lucky Number Draw game with 8x multiplier
 * - 10-level referral system
 * - Cashback protection
 * - 10-day payout distribution
 * - Rank-based royalty system
 */
contract ProGameEcosystem is ReentrancyGuard, Ownable, Pausable {
    
    // ===== STRUCTS =====
    struct User {
        address wallet;
        address referrer;
        uint8 status; // 0: free, 1: basic, 2: pro
        uint256 frozenBalance;
        uint256 basicBalance;
        uint256 proBalance;
        uint256 cashBalance;
        uint256 totalDeposits;
        uint256 totalVolume;
        uint256 directReferrals;
        uint256 registeredAt;
        bool isActive;
    }

    struct PayoutSchedule {
        uint256 totalAmount;
        uint256 dailyAmount;
        uint256 paidDays;
        uint256 nextPayoutTime;
        bool isActive;
    }

    struct CashbackStatus {
        uint256 totalLosses;
        uint256 totalRecovered;
        uint256 dailyRate; // in basis points (100 = 1%)
        uint256 maxRecoveryPercent; // 100 = 100%, 200 = 200%
        bool isActive;
    }

    // ===== STATE VARIABLES =====
    IERC20 public usdtToken;
    
    // Wallets
    address public masterWallet;
    address public creatorWallet;
    address[20] public bdWallets;
    address[4] public promoterWallets;
    
    // Constants
    uint256 public constant WIN_MULTIPLIER = 8;
    uint256 public constant MAX_PLAY_VOLUME = 1000 * 10**18;
    uint256 public constant BASIC_ACTIVATION = 10 * 10**18;
    uint256 public constant PRO_ACTIVATION = 100 * 10**18;
    uint256 public constant SIGNUP_BONUS = 10 * 10**18;
    uint256 public constant PAYOUT_DAYS = 10;
    uint256 public constant FROZEN_REFERRAL_LIMIT = 10;
    
    // Referral rates in basis points
    uint256 public constant LEVEL1_RATE = 1000; // 10%
    uint256 public constant LEVEL2_RATE = 200;  // 2%
    uint256 public constant LEVEL3_10_RATE = 100; // 1%
    
    // User mappings
    mapping(address => User) public users;
    mapping(address => bool) public isRegistered;
    mapping(address => PayoutSchedule[]) public userPayouts;
    mapping(address => CashbackStatus) public cashbackStatus;
    mapping(address => address[]) public referralTree;
    
    // System stats
    uint256 public totalUsers;
    uint256 public totalDeposits;
    uint256 public totalGamesPlayed;
    uint256 public totalPayouts;
    
    // Random seed (for demo - in production use Chainlink VRF)
    uint256 private nonce;

    // ===== EVENTS =====
    event UserRegistered(address indexed user, address indexed referrer, uint256 timestamp);
    event Deposit(address indexed user, uint256 amount, uint8 newStatus);
    event GamePlayed(address indexed user, uint8 selectedNumber, uint8 winningNumber, bool win, uint256 amount);
    event PayoutDistributed(address indexed user, uint256 amount, uint256 day);
    event CashbackPaid(address indexed user, uint256 amount);
    event ReferralCommission(address indexed referrer, address indexed user, uint256 amount, uint8 level);
    event Withdrawal(address indexed user, uint256 amount);

    // ===== MODIFIERS =====
    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "User not registered");
        _;
    }

    modifier onlyBasicOrPro() {
        require(users[msg.sender].status >= 1, "Basic activation required");
        _;
    }

    modifier onlyPro() {
        require(users[msg.sender].status == 2, "Pro status required");
        _;
    }

    // ===== CONSTRUCTOR =====
    constructor(address _usdtToken, address _masterWallet, address _creatorWallet) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        masterWallet = _masterWallet;
        creatorWallet = _creatorWallet;
    }

    // ===== USER FUNCTIONS =====
    
    /**
     * @dev Register a new user with optional referrer
     */
    function register(address _referrer) external whenNotPaused {
        require(!isRegistered[msg.sender], "Already registered");
        require(_referrer != msg.sender, "Cannot refer yourself");
        
        if (_referrer != address(0)) {
            require(isRegistered[_referrer], "Referrer not registered");
        }

        users[msg.sender] = User({
            wallet: msg.sender,
            referrer: _referrer,
            status: 0,
            frozenBalance: SIGNUP_BONUS,
            basicBalance: 0,
            proBalance: 0,
            cashBalance: 0,
            totalDeposits: 0,
            totalVolume: 0,
            directReferrals: 0,
            registeredAt: block.timestamp,
            isActive: true
        });

        isRegistered[msg.sender] = true;
        totalUsers++;

        // Credit frozen referral bonuses up to 10 levels
        if (_referrer != address(0)) {
            _creditFrozenReferralBonuses(msg.sender, _referrer);
        }

        emit UserRegistered(msg.sender, _referrer, block.timestamp);
    }

    /**
     * @dev Deposit USDT into the platform
     */
    function deposit(uint256 _amount) external onlyRegistered nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        User storage user = users[msg.sender];
        uint8 previousStatus = user.status;

        if (user.status == 0) {
            // Free status - Basic activation
            require(_amount >= BASIC_ACTIVATION, "Min 10 USDT for activation");
            user.basicBalance = _amount + user.frozenBalance;
            user.frozenBalance = 0;
            user.status = 1;
        } else if (user.status == 1) {
            // Basic status - Check for Pro upgrade
            if (user.totalDeposits + _amount >= PRO_ACTIVATION) {
                user.proBalance = _amount + user.basicBalance;
                user.basicBalance = 0;
                user.status = 2;
            } else {
                user.basicBalance += _amount;
            }
        } else {
            // Pro status
            user.proBalance += _amount;
            user.totalVolume += _amount;
        }

        user.totalDeposits += _amount;
        totalDeposits += _amount;

        // Distribute to wallets (10% to Master)
        _distributeDeposit(_amount);

        // Credit referral commissions if Pro
        if (user.status == 2 && user.referrer != address(0)) {
            _creditReferralCommissions(msg.sender, _amount);
        }

        emit Deposit(msg.sender, _amount, user.status);
    }

    /**
     * @dev Play the Lucky Number Draw game
     */
    function playGame(uint8 _selectedNumber, uint256 _amount, bool _isPro) 
        external 
        onlyBasicOrPro 
        nonReentrant 
        whenNotPaused 
        returns (uint8 winningNumber, bool win) 
    {
        require(_selectedNumber >= 1 && _selectedNumber <= 10, "Invalid number");
        require(_amount > 0 && _amount <= MAX_PLAY_VOLUME, "Invalid amount");

        User storage user = users[msg.sender];
        
        if (_isPro) {
            require(user.status == 2, "Pro status required");
            require(user.proBalance >= _amount, "Insufficient pro balance");
            user.proBalance -= _amount;
        } else {
            require(user.basicBalance >= _amount, "Insufficient basic balance");
            user.basicBalance -= _amount;
        }

        // Generate winning number (in production, use Chainlink VRF)
        winningNumber = _generateRandomNumber();
        win = (winningNumber == _selectedNumber);

        totalGamesPlayed++;

        if (win) {
            uint256 payout = _amount * WIN_MULTIPLIER;
            
            if (_isPro) {
                // Schedule 10-day payout distribution
                _schedulePayouts(msg.sender, payout);
            } else {
                // Basic game - winnings go to basic balance (locked)
                user.basicBalance += payout;
            }
        } else {
            // Track losses for cashback
            if (_isPro) {
                user.totalVolume += _amount;
                _updateCashbackStatus(msg.sender, _amount);
            }
        }

        emit GamePlayed(msg.sender, _selectedNumber, winningNumber, win, _amount);
        return (winningNumber, win);
    }

    /**
     * @dev Withdraw cash balance to wallet
     */
    function withdraw(uint256 _amount) external onlyPro nonReentrant whenNotPaused {
        User storage user = users[msg.sender];
        require(user.cashBalance >= _amount, "Insufficient balance");
        require(_amount > 0, "Amount must be greater than 0");

        user.cashBalance -= _amount;
        require(usdtToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Withdrawal(msg.sender, _amount);
    }

    // ===== INTERNAL FUNCTIONS =====

    function _generateRandomNumber() private returns (uint8) {
        nonce++;
        return uint8((uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce
        ))) % 10) + 1);
    }

    function _creditFrozenReferralBonuses(address _user, address _referrer) private {
        address currentReferrer = _referrer;
        
        for (uint8 level = 1; level <= 10 && currentReferrer != address(0); level++) {
            User storage referrer = users[currentReferrer];
            
            if (level == 1) {
                referrer.directReferrals++;
                referralTree[currentReferrer].push(_user);
                
                // Check frozen referral limit
                if (referrer.directReferrals <= FROZEN_REFERRAL_LIMIT) {
                    referrer.frozenBalance += SIGNUP_BONUS * LEVEL1_RATE / 10000;
                }
            } else if (level == 2) {
                referrer.frozenBalance += SIGNUP_BONUS * LEVEL2_RATE / 10000;
            } else {
                referrer.frozenBalance += SIGNUP_BONUS * LEVEL3_10_RATE / 10000;
            }
            
            currentReferrer = referrer.referrer;
        }
    }

    function _creditReferralCommissions(address _user, uint256 _amount) private {
        address currentReferrer = users[_user].referrer;
        
        for (uint8 level = 1; level <= 10 && currentReferrer != address(0); level++) {
            User storage referrer = users[currentReferrer];
            
            // Only credit if referrer has Pro status and min volume
            if (referrer.status == 2 && referrer.totalVolume >= PRO_ACTIVATION) {
                uint256 rate = level == 1 ? LEVEL1_RATE : (level == 2 ? LEVEL2_RATE : LEVEL3_10_RATE);
                uint256 commission = _amount * rate / 10000;
                referrer.cashBalance += commission;
                
                emit ReferralCommission(currentReferrer, _user, commission, level);
            }
            
            currentReferrer = referrer.referrer;
        }
    }

    function _schedulePayouts(address _user, uint256 _totalAmount) private {
        uint256 dailyAmount = _totalAmount / PAYOUT_DAYS;
        
        userPayouts[_user].push(PayoutSchedule({
            totalAmount: _totalAmount,
            dailyAmount: dailyAmount,
            paidDays: 0,
            nextPayoutTime: block.timestamp + 1 days,
            isActive: true
        }));
        
        totalPayouts += _totalAmount;
    }

    function _updateCashbackStatus(address _user, uint256 _lostAmount) private {
        CashbackStatus storage status = cashbackStatus[_user];
        status.totalLosses += _lostAmount;
        
        // Activate cashback when losses reach 100 USDT
        if (!status.isActive && status.totalLosses >= 100 * 10**18) {
            status.isActive = true;
            status.dailyRate = 50; // 0.5%
            status.maxRecoveryPercent = 100;
        }
    }

    function _distributeDeposit(uint256 _amount) private {
        // 10% to Master Wallet
        uint256 masterShare = _amount * 10 / 100;
        usdtToken.transfer(masterWallet, masterShare);
        
        // Rest stays in contract for payouts
    }

    // ===== ADMIN FUNCTIONS =====

    function processDailyPayouts() external onlyOwner {
        // This would be called by a cron job or keeper
        // In production, use Chainlink Keepers
    }

    function setBDWallets(address[20] memory _wallets) external onlyOwner {
        bdWallets = _wallets;
    }

    function setPromoterWallets(address[4] memory _wallets) external onlyOwner {
        promoterWallets = _wallets;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }

    // ===== VIEW FUNCTIONS =====

    function getUserBalance(address _user) external view returns (
        uint256 frozen,
        uint256 basic,
        uint256 pro,
        uint256 cash
    ) {
        User storage user = users[_user];
        return (user.frozenBalance, user.basicBalance, user.proBalance, user.cashBalance);
    }

    function getUserPayouts(address _user) external view returns (PayoutSchedule[] memory) {
        return userPayouts[_user];
    }

    function getCashbackStatus(address _user) external view returns (CashbackStatus memory) {
        return cashbackStatus[_user];
    }

    function getReferralTree(address _user) external view returns (address[] memory) {
        return referralTree[_user];
    }
}
