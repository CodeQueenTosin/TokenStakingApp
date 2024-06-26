// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//Import Contract

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Initializable.sol";
import "./IERC20.sol";

contract TokenStaking is Ownable, ReentrancyGuard, Initializable {
    
     struct User {
      
      uint256 stakeAmount;
      uint256 rewardAmount;
      uint256 lastStakeTime;
      uint256 lastRewardCalculationTime;
      uint256 rewardsClaimedSofar;

     }

     uint256 _minimumStakingAmount;

     uint256 _maxStakeTokenLimit;

     uint256 _stakeEndDate;

     uint256 _stakeStartDate;

     uint256 _totalStakedTokens;

     uint256 _totalUsers;

    uint256 _stakeDays;

    uint256 _earlyUnstakeFeePercentage;

    bool _isStakingPaused;
   
    address private _tokenAddress;

    uint256 _apyRate;

    uint256 public constant PERCENTAGE_DENOMINATOR = 10000;

   uint256 public constant APY_RATE_CHANGE_THRESHOLD = 10;

   mapping (address => User) private _users;

   event Stake(address indexed user, uint256 amount);
      
   event UnStake(address indexed user, uint256 amount);
        
  event EarlyUnStakeFee(address indexed user, uint256 amount);

  event ClaimReward(address indexed user, uint256 amount);
  
  modifier whenTreasuryHasBalance(uint256 amount){ require(IERC20(_tokenAddress).balanceOf(address(this)) >= amount, "TokenStaking: Insufficient funds in Treasury");
                                  _;
  }
 
  function initialize(address owner_, address tokenAddress_, uint256 apyRate_, uint256 minimumStakingAmount_,
     uint256 maxStakeTokenLimit_,
     uint256 stakeStartDate_,
     uint256 stakeEndDate_,
     uint256 stakeDays_,
     uint256 earlyUnstakeFeePercentage_) 
     public virtual initializer {__TokenStaking_init_unchained(owner_, 
     tokenAddress_, apyRate_, minimumStakingAmount_, maxStakeTokenLimit_, stakeStartDate_, stakeEndDate_, stakeDays_, earlyUnstakeFeePercentage_);
     
     
     }

     function __TokenStaking_init_unchained (address owner_, address tokenAddress_, uint256 apyRate_, uint256 minimumStakingAmount_, uint256 maxStakeTokenLimit_, uint256 stakeStartDate_, uint256 stakeEndDate_, uint256 stakeDays_, uint256 earlyUnstakeFeePercentage_) internal onlyInitializing {
         
         require(_apyRate <= 10000, "TokenStaking: apyRate should be less than 1000");
         require(stakeDays_ > 0, "TokenStake: stake days must be greater than 0");
         require(tokenAddress_ != address(0), "TokenStaking: token address cannot be 0 address");
         require(stakeStartDate_ < stakeEndDate_, "TokenStaking: startdate must be less than end date");

          _transferOwnership(owner_);
          _tokenAddress = tokenAddress_;
          _apyRate = apyRate_;
          _minimumStakingAmount = minimumStakingAmount_;
          _maxStakeTokenLimit = maxStakeTokenLimit_;
          _stakeStartDate = stakeStartDate_;
          _stakeEndDate = stakeEndDate_;
          _stakeDays = stakeDays_ * 1 days;
          _earlyUnstakeFeePercentage = earlyUnstakeFeePercentage_;

     } 

     // View Methods Start

      function getMinimumStakingTokenLimit() external view returns(uint256)
     {
        return _minimumStakingAmount;
     }

     function getMaxStakingTokenLimit() external view returns (uint256){
          return _maxStakeTokenLimit;
     } 

     function getStakeStartDate() external view returns (uint256) {
          return _stakeStartDate;
     }

     function getStakeEndDate() external view returns (uint256) {
         return _stakeEndDate;
     }

     function getTotalStakedTokens() external view returns(uint256){
         return _totalStakedTokens;
     }

   function getTotalUsers() external view returns (uint256){
         return _totalUsers;
   }

   function getStakeDays () external view returns (uint256){
        return _stakeDays;
   }

     function getEarlyUnstakeFeePercentage() external view returns (uint256) {
         return _earlyUnstakeFeePercentage;
     }

     function getAPY() external view returns(uint256){
         return _apyRate;
     }

    function getMinimumStakingAmount() external view returns (uint256){
       return _minimumStakingAmount;
    }

  function getUserEstimatedRewards() external view returns (uint256){
      (uint256 amount, ) = _getUserEstimatedRewards(msg.sender);
       return _users[msg.sender].rewardAmount + amount;
  }

  function getWithdrawableAmount() external view returns(uint256){
     return IERC20(_tokenAddress).balanceOf(address(this)) - _totalStakedTokens;
  }

  function getUser(address useraddress) external view returns (User memory){
      return _users[useraddress];
  }

 function getStakingStatus() external view returns(bool){
    return _isStakingPaused;
  }

  function isStakeHolder(address _user) external view returns(bool){
      return _users[_user].stakeAmount !=0;
  }

 function updateMinimumStakingAmount(uint256 newAmount) external onlyOwner {
      _minimumStakingAmount = newAmount;
 }

  function updateMaximumStakingAmount(uint256 newAmount) external onlyOwner {
      _maxStakeTokenLimit = newAmount;
  }
   
function updateStakingEndDate(uint256 newDate) external onlyOwner {
      _stakeEndDate = newDate;
}

// function updateEarlyUnstakeFeePercentage(uint256 newPercentage) external OnlyOwner {
//      _earlyUnstakeFeePercentage = newPercentage;
// }

 function stakeForUser(uint256 amount, address user) external onlyOwner nonReentrant {
      _stakeTokens(amount, user);

 }

 function toggleStakingStatus() external onlyOwner {
      
      _isStakingPaused = !_isStakingPaused;
 
 }

 function withdraw(uint256 amount) external onlyOwner nonReentrant {
     require(this.getWithdrawableAmount() >= amount, "TokenStaking: not enough withdrawable Tokens");
      IERC20(_tokenAddress).transfer(msg.sender, amount);
 
 }

 //User Methods  to stake, withdraw and get Rewards

// Function to STAKE
 function stake(uint256 _amount) external nonReentrant{
       _stakeTokens(_amount, msg.sender);
 }

 function _stakeTokens(uint256 _amount, address user_) private {
      require(!_isStakingPaused, "TokenStaking: staking is paused");
       
       uint256 currentTime = getCurrentTime();
       require (currentTime > _stakeStartDate, "TokenStaking: staking not started yet");
       require (currentTime < _stakeEndDate, "TokenStaking: staking ended");
       require(_totalStakedTokens + _amount <= _maxStakeTokenLimit, "TokenStaking: max staking token limit reached");
       require(_amount > 0, "TokenStaking: stake amount can't be less than 0");
       require(_amount >= _minimumStakingAmount, "TokenStaking: stake amount must be greater than minimum amount allowed");

       if (_users[user_].stakeAmount !=0){
          _calculateRewards(user_);
       }else{
          _users[user_].lastRewardCalculationTime = currentTime;
          _totalUsers +=1;
       }

       _users[user_].stakeAmount += _amount;
       _users[user_].lastStakeTime = currentTime;

       _totalStakedTokens += _amount;
       
       require (IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount), "TokenStaking: Failed to transfer tokens");
          emit Stake(user_, _amount);        
 }

      //function used to Unstake Tokens, Withdrwa  tokens

       function unstake(uint256 _amount) external nonReentrant whenTreasuryHasBalance(_amount){
          address user = msg.sender;
           require(_amount !=0, "TokenStaking: amount should be non-zero");
           require(this.isStakeHolder(user), "TokenStaking: not a stakeHolder");
           require(_users[user].stakeAmount >= _amount, "TokenStaking: not enough stake to unstake");
       
          //Calculate User Rewards 

        _calculateRewards(user);

         uint256 feeEarlyUnstake;

         if(getCurrentTime() <= _users[user].lastStakeTime + _stakeDays){
              feeEarlyUnstake = ((_amount * _earlyUnstakeFeePercentage) / PERCENTAGE_DENOMINATOR);
              emit EarlyUnStakeFee(user, feeEarlyUnstake);
         }

         uint256 amountToUnstake = _amount - feeEarlyUnstake;

         _users[user].stakeAmount -= _amount;

         _totalStakedTokens -= _amount;

         if(_users[user].stakeAmount == 0){
            // delete the user
              _totalUsers -= 1;
         } 

         require(IERC20(_tokenAddress).transfer(user, amountToUnstake), "TokenSTaking: failed to transfer");
          emit UnStake(user, _amount);
       
       }

    /// Function to Claim Rewards


    function claimReward() external nonReentrant whenTreasuryHasBalance(_users[msg.sender].rewardAmount) {
            _calculateRewards(msg.sender);
            uint256 rewardAmount = _users[msg.sender].rewardAmount;
            require(rewardAmount > 0, "TokenStaking: no reward to claim");
            require(IERC20(_tokenAddress).transfer(msg.sender, rewardAmount), "TokenStaking: failed to transfer");
            _users[msg.sender].rewardAmount = 0;
            _users[msg.sender].rewardsClaimedSofar += rewardAmount;
            emit ClaimReward(msg.sender, rewardAmount);
    }

       // End Of User Methods

       function _calculateRewards(address _user) private {(uint256 userReward, uint256 currentTime) = 
       _getUserEstimatedRewards(_user);
         
          _users[_user].rewardAmount += userReward;
          
           _users[_user].lastRewardCalculationTime = currentTime;

       }

       function _getUserEstimatedRewards(address _user) private view returns(uint256, uint256)
       {
          uint256 userReward;
          uint256 userTimeStamp = _users[_user].lastRewardCalculationTime;

          uint256 currentTime = getCurrentTime();

          if(currentTime > _users[_user].lastStakeTime + _stakeDays){
               currentTime = _users[_user].lastStakeTime + _stakeDays;
          }

          uint256 totalStakedTime = currentTime - userTimeStamp;

          userReward += ((totalStakedTime * _users[_user].stakeAmount * _apyRate)/ 365 days)/ 
          PERCENTAGE_DENOMINATOR;

          return (userReward, currentTime);

       }

    // function to get currnt time

    function getCurrentTime() internal view returns(uint256) {
          return block.timestamp;
    }

         
 }


