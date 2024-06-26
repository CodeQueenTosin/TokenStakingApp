loadInitialData("sevenDays");

connectMe("metamask_wallet");

function connectWallet() {}
 

function openTab (event, name){
     console.log(name);
     contractCall = name;
     getSelectedTab (name);
     loadInitialData(name);
}

async function loadInitialData(sClass){
    let notification;

     console.log(sClass);
     try{
        clearInterval(countDownGlobal);
        let cObj = new web3Main.eth.Contract(
            SELECT_CONTRACT[_NETWORK_ID].STACKING.abi, 
            SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address);

            //GET ID ELEMENT DATA
        
        //let totalUsers = await cObj.methods.getTotalUsers().call();;

        let totalUsers = await cObj.methods.getTotalUsers().call();
        //let totalUsers = 40;

        let cApy = await cObj.methods.getAPY().call();

        let userDetail = await cObj.methods.getUser(currentAddress).call();

        const user = {
              lastRewardCalculationTime : userDetail.lastRewardCalculationTime,
              lastStakeTime: userDetail.lastStakeTime,
              rewardAmount: userDetail.rewardAmount,
              rewardsClaimedSoFar: userDetail.rewardsClaimedSoFar,
              stakeAmount: userDetail.stakeAmount,
              address: currentAddress,
        };
        localStorage.setItem("User", JSON.stringify(user));

        let userDetailBal = userDetail.stakeAmount / 10 ** 18;

        document.getElementById("total-locked-user-token").innerHTML = `${userDetailBal}`;
        document.getElementById("num-of-stackers-value").innerHTML = `${totalUsers}`;
        document.getElementById("apy-value-feature").innerHTML = `${cApy} % `;

        //class element data
        let totalLockedTokens = await cObj.methods.getTotalStakedTokens().call();
        let earlyUnstakeFee = await cObj.methods.getEarlyUnstakeFeePercentage().call();

        document.getElementById("total-locked-tokens-value").innerHTML = `${ totalLockedTokens / 10 ** 18 
         } ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;

        document.querySelectorAll(".early-unstake-fee-value")
                .forEach(function(element){
                    element.innerHTML = `${earlyUnstakeFee /100}%`;
                });

        let minStakeAmount = await cObj.methods.getMinimumStakingAmount().call();

        //let minStakeAmount = 30;
    
        minStakeAmount = Number(minStakeAmount);
        
        let minA;

        if(minStakeAmount){
                minA = `${(minStakeAmount / 10 ** 18).toLocaleString()} ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
                }`;
            
        }else{
            minA = "N/A";
        }

        document.querySelectorAll(".Minimum-Staking-Amount")
                .forEach(function(element){
                     element.innerHTML = `${minA}`;
                });

                document.querySelectorAll(".Maximum-Staking-Amount")
                         .forEach(function(element){
                         element.innerHTML = `${(5000).toLocaleString()} ${
                            SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
                                           
                        }`;
                });
       
        let isStakingPaused = await cObj.methods.getStakingStatus().call();
        //let isStakingPaused = false;
        let isStakingPausedText;

        let startDate = await cObj.methods.getStakeStartDate().call();
          
        startDate = Number(startDate) * 1000;

        let endDate = await cObj.methods.getStakeEndDate().call();
         
        endDate = Number(endDate) * 1000;

        let stakeDays = await cObj.methods.getStakeDays().call();

        let days = Math.floor(Number(stakeDays) / (3600 * 24));

        let dayDisplay = days > 0 ? days + (days ==1 ? " day," : "days,") : "";

        document.querySelectorAll(".Lock-period-value").forEach(function(element){
              element.innerHTML = `${dayDisplay}`;

        });

        let rewardBal = await cObj.methods.getUserEstimatedRewards().call({from: currentAddress });
      // let rewardBal =  500;

        document.getElementById("user-reward-balance-value").value = `Reward: ${
            rewardBal / 10 ** 18 }
            ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`

       
        let balMainUser = currentAddress ? await oContractToken.methods.balanceOf(currentAddress).call() : "";
      
        balMainUser = Number(balMainUser) / 10 ** 18;

        document.getElementById("user-token-balance").innerHTML = `Balance: ${balMainUser}`;

        let currentDate = new Date ().getTime();

        if(isStakingPaused){
             isStakingPausedText = "Paused";

        }else if(currentDate < startDate) {
            isStakingPausedText = "Locked";

        }else if (currentDate > endDate) {
            isStakingPausedText = "Ended";

        }else {
            isStakingPausedText = "Active";
        }

        document.querySelectorAll(".active-status-stacking")
                 .forEach(function(element){
                    element.innerHTML = `${isStakingPausedText}`;
                 });

                 if(currentDate > startDate && currentDate < endDate){
                      const ele = document.getElementById("countdown-time-value");
                      generateCountDown(ele, endDate);

                      document.getElementById("countdown-title-value").innerHTML = `Staking Ends in`;
                 }
        
                 if(currentDate < startDate){
                      const ele = document.getElementById("countdown-time-value")
                       generateCountDown(ele, endDate);

                       document.getElementById("countdown-title-value").innerHTML = `Staking starts in`;
                 }


                 document.querySelectorAll(".apy-value").forEach(function(element){
                    element.innerHTML = `${cApy} %`;
                 });
                }catch(error){
                     console.log(error);
                     
                     notyf.error(`Unable to fetch data from  ${SELECT_CONTRACT[_NETWORK_ID].network_name} !\n Please refresh this page`);
                     console.log("jjjjj");
                
                    }

            }


















         function generateCountDown (ele, claimDate){
              clearInterval(countDownGlobal);

              var countDownDate = new Date (claimDate).getTime();

              countDownGlobal = setInterval (function (){
                   var now = new Date().getTime();

                   var distance = countDownDate - now;

                   var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                   
                   var hours = Math.floor(distance %(1000 * 60 * 60 * 24)) / (1000 * 60 * 60);

                   var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                   var seconds = Math.floor((distance %(1000 * 60))/ 1000);

                   //display the result in the elememt
                   ele.innerHTML = days + "d" + hours + "h" + minutes + "m" + seconds + "s";

                 //If the countdown finishes write some text

                 if(distance < 0){
                      clearInterval(countDownGlobal);
                      ele.html("Refresh Page");
                 }
                }, 1000);



              
            }
              
              
      async function connectMe(_provider){
          try {
              let _comn_res = await commonProviderDetector(_provider);
              console.log(_comn_res);
              if(!_comn_res) {
                  console.log("Please connect");

              }else{
                 let sClass = getSelectedTab();
                 console.log(sClass);

              }

          }catch(error){
              notyf.error(error.message);
          }
      }

      async function stackTokens(){
          try{
             let nTokens = document.getElementById ("amount-to-stack-value-new").value;

             if(!nTokens){
                 return;
             }

             if(isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0){
                  console.log(`Invalid token Amount!`);
                  return;
             }

             nTokens = Number(nTokens);

             let tokenToTransfer = addDecimal(nTokens, 18);
             
             console.log("tokenToTransfer", tokenToTransfer);

            let balMainUser = await oContractToken.methods.balanceOf(currentAddress).call();
            
            balMainUser = Number(balMainUser)/ 10 ** 18;

             console.log("balMainUser", balMainUser);
             
             if(balMainUser < nTokens){
                  notyf.error(`Insufficient Tokens on ${SELECT_CONTRACT[_NETWORK_ID].name} !\n Please buy some tokens first`);
             
                  return;
                }

                let sClass = getSelectedTab(contractCall);

                console.log(sClass);
                
                let balMainAllowance = await oContractToken.methods.allowance(currentAddress, SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address).call();
  
                if(Number(balMainAllowance < Number(tokenToTransfer))){
                     approveTokenSpend(tokenToTransfer, sClass);
                }else{
                     stackTokenMain(tokenToTransfer, sClass);
                }
                }catch(error){
                     console.log(error);
                     //notyf.dismiss(notification);
                     notyf.error(formatEthErrorMsg(error));
                    
                }
                

            async function approveTokenSpend(_mint_fee_wei, sClass){
                  let gasEstimation;

                  try{
                      gasEstimation = await oContractToken.methods.approve(SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address, _mint_fee_wei).estimateGas({
                        from: currentAddress,
                      });
                  } catch (error){
                      console.log(error);
                      notyf.error(formatEthErrorMsg(error));
                      return;
                  }

                  oContractToken.methods.approve
                  (SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address, 
                    _mint_fee_wei)
                   .send({
                       from: currentAddress,
                       gas: gasEstimation,
                   })
                    .on("transactionHash", (hash) => {
                          console.log("Transaction Hash:", hash);
                    })
                    .on("receipt", (receipt) => {
                         console.log(receipt);
                          stackTokenMain(_mint_fee_wei);
                    })
                    .catch((error) => {
                          console.log(error);
                          notyf.error(formatEthErrorMsg(error));
                          return;
                    });
            }
             
         
            async function stackTokenMain(_amount_wei, sClass){
                  
                let gasEstimation;

                  let oContractStacking = getContractObj(sClass);
                  
                  try {
                      gasEstimation = await oContractStacking.methods.stake(_amount_wei).estimateGas({
                          from: currentAddress,  
                      });

                  } catch(error){
                      console.log(error);
                      notyf.error(formatEthErrorMsg(error));
                      return;


                  }

                  oContractStacking.methods.stake(_amount_wei).send({
                       from: currentAddress,
                        gas: gasEstimation,
                  }).on("receipt", (receipt)=> {
                    console.log(receipt);
                    const receiptObj ={
                        token: _amount_wei,
                        from: receipt.to,
                        to: receipt.to,
                        blockHash: receipt.blockHash,
                        blockNumber: receipt.blockNumber,
                        cummulativeGasUsed: receipt.cummulativeGasUsed,
                        effectiveGasPrice: receipt.effectiveGasPrice,
                        gasUsed: receipt.gasUsed,
                        status: receipt.status,
                        transactionHash: receipt.transactionHash,
                        type: receipt.type,

                    };

                    let transactionHistory = [];

                    const allUserTransaction = localStorage.getItem("transactions");

                    if(allUserTransaction){
                        transactionHistory = JSON.parse(localStorage.getItem("transactions"));
                         transactionHistory.push(receiptObj);
                         localStorage.setItem("transactions", JSON.stringify(transactionHistory));
                         
                    }else{
                         transactionHistory.push(receiptObj);
                         localStorage.setItem("transactions", JSON.stringify(transactionHistory));
                    }

                  })

               
             
            }

            //console.log(allUserTransaction);
            // window.location.href = "http://127.0.0.1:5500/analytic.html"
            // .on("transactionHash", (hash) => {
            //    console.log("Transaction Hash", hash);
            // })
            // .catch((error)=>{
            //     console.log(error);
            //     notyf.error(formatEthErrorMsg(error));
            //     return;
            // });
    
        
        }

        async function unstackTokens(){
             try{
                 let nTokens = document.getElementById("amount-to-unstack-value");
                 if(!nTokens){
                     return;
                 }

                 if(isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0){
                     notyf.error(`Invalid token amount`);
                     return;

                 }
                 nTokens = Number(nTokens);

                 let tokenToTransfer = addDecimal(nTokens, 18);

                 let sClass = getSelectedTab(contractCall);

                 let oContractStacking = getContractObj(sClass);

                 let balMainUser = await oContractStacking.methods.getUser(currentAddress).call();

                 balMainUser = Number(balMainUser.stakeAmount) / 10 ** 18;

                 if(balMainUser < nTokens){
                      notyf.error(`Insufficient staked tokens on ${SELECT_CONTRACT[_NETWORK_ID].network_name} !\n  Insufficeitn staked tokens on ${SELECT_CONTRACT[_NETWORK_ID].network_name}`);
                      return;

                 }

                 unstackTokenMain(tokenToTransfer, oContractStacking, sClass); 
                }catch(error){
                        console.log(error);
                        //notyf.dismiss(notification);
                        notyf.error(formatEthErrorMsg(error));
                    }
                }

                
                async function unstackTokenMain(_amount_wei, oContractStacking, sClass)
                {
                    let gasEstimation;

                    try{
                        gasEstimation = await oContractStacking.methods.unstake(_amount_wei)
                        .estimateGas({
                             from: currentAddress,

                        });

                    }catch(error){
                         console.log(error);
                         notyf.error(formatEthErrorMsg(error));
                         return;
                    }

                    onContractStacking.methods.unstake(_amount_wei).send({
                         from: currentAddress,
                          gas: gasEstimation,
                    }).on("receipt", (receipt)=>{
                          console.log(receipt);
                          const receiptObj = {
                              token: _amount_wei,
                              from: receipt.from,
                              to: receipt.to,
                              blockHash: receipt.blockHash,
                              blockNumber: receipt.blockNumber,
                              cummulativeGasUsed: receipt.cummulativeGasUsed,
                              effectiveGasPrice: receipt.effectiveGasPrice,
                              gasUsed: receipt.gasUsed,
                              status: receipt.status,
                              transactionHash: receipt.transactionHash,
                              type: receipt.type,
                          };

                          let transactionHistory = [];

                          const allUserTransaction = localStorage.getItem("transactions");
                          if(allUserTransaction) {
                              transactionHistory = JSON.parse(localStorage.getItem("transactions"));
                              transactionHistory.push(receiptObj);
                              localStorage.setItem("transactions", JSON.stringify(transactionHistory));

                          } else {
                            transactionHistory.push(receiptObj);
                            localStorage.setItem("transactions", JSON.stringify(transactionHistory));

                          }

                          window.location.href = "https://127.0.0.1:5500/analytic.html";
                        })
                        .on("transactionHash", (hash) =>{
                             console.log("Transaction Hash:", hash);
                        })

                        .catch((error) => {
                            console.log(error);
                            notyf.error(formatEthErrorMsg(error));
                            return;
                        });



                    }

              async function claimTokens(){
                  try{
                     let sClass = getSelectedTab(contractCall);
                     let oContractStacking  = getContractObj(sClass);
                     let rewardBal = await oContractStacking.methods
                       .getUserEstimatedRewards()
                       .call({ from: currentAddress });
                        rewardBal = Number(rewardBal);
                        console.log("rewardBal", rewardBal);
                        if(!rewardBal){
                             notyf.dismiss(notification);
                             notyf.error(`insufficient reward token to claim!`);
                             return;
                        }

                        claimTokenMain(oContractStacking, sClass);
                    }catch(error){
                         console.log(error);
                         notyf.dismiss(notification);
                         notyf.error(formatEthErrorMsg(error));

                    }
                  }
                
                  async function claimTokenMain(oContractStacking, sClass){
                       let gasEstimation;


                       try {
                          gasEstimation = await oContractStacking.methods.claimReward().estimateGas({
                              from: currentAddress,
                          });
                          console.log("gasEstimation", gasEstimation);
                       }catch (error) {
                          console.log(error);
                          notyf.error(formatEthErrorMsg(error));
                          return;
                       }

                       onContractStacking.methods
                        .claimReward()
                        .send({
                             from: currentAddress,
                             gas: gasEstimation,
                        })
                        .on("receipt", (receipt) => {
                              console.log(receipt);
                              const receiptObj = {
                                  from: receipt.from,
                                  to: receipt.to,
                                  blockHash:  receipt.blockHash,
                                  blockNumber: receipt.blockNumber,
                                  cummulativeGasUsed: receipt.cummulativeGasUsed,
                                  effectiveGasPrice: receipt.effectiveGasPrice,
                                  gasUsed: receipt.gasUsed,
                                  status: receipt.status,
                                  transactionHash: receipt.transactionHash,
                                  type: receipt.type,

                              };

                              let transactionHistory = [];

                              const allUserTransaction = localStorage.getItem("transactions");
                              if(allUserTransaction){
                                  transactionHistory = JSON.parse(localStorage.getItem("transactions"));
                                  transactionHistory.push(receiptObj);
                                  localStorage.setItem("transactions", JSON.stringify(transactionHistory));
                              }else {
                                    transactionHistory.push(receiptObj);
                                    localStorage.setItem("transactions", JSON.stringify(transactionHistory));
                              }

                              window.location.href = "http://127.0.0.1:5500/analytic.html";

                        })
                              .on("transactionHash", (hash) => {
                                  console.log("Transaction Hash: ", hash);
                              })
                              .catch((error) => {
                                  console.log(error);
                                  notyf.error(formatEthErrorMsg(error));
                                  return;
                              });
                  }




      











