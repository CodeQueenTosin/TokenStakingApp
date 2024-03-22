/* async function commonProviderDetector(_provider){
     if(_provider == "metamask_wallet"){
          if(window.etherum && window.etherum.providers){
             const metamaskProvider = window.etherum.providers.find(
                 (provider) => provider.isMetaMask
             );
               if(metamaskProvider) {
                   window.etherum.providers = [metamskProvider];
                    return await commonInjectedConnect(metamaskProvider, _provider);

               } else{
                console.log("metamask wallet not found");
                
                window.open("https://metamask.io/download", "_blank").focus();

                return false;
               }
          }else if(window.etherum){
             return await commonInjectedConnect(window.etherum, _provider); 
          }else {
             console.log("metamask wallet not found");

             try {
             
                window.open("https://metamask.io/download", "_blank").focus();
             
                } catch(error) {}
             
                return false;
          }

        }
     }


async function commonInjectedConnect(_provider, _provider_name){
      await _provider.enable();

      setWeb3event (_provider);

      web3 = new Web3(_provder);

      let currentNetworkId = await web3.eth.getChainId();

      currentNetworkId = currentNetworkId.toString();

      const accounts = await web3.getAccounts();

      console.log("-> accounts");

      console.log(accounts);

      currentAddress = accounts[0].toLowerCase();

      if(currentNetworkId != _NETWORK_ID){
          notyf.error ('Please connect wallet on ${SELECT_CONTRACT[_NETWORK_ID].network-name}!');
            return false;
        }

    onContractToken = new web3.eth.Contract (SELECT_CONTRACT[_NETWORK_ID].TOKEN.abi, SELECT_CONTRACT[_NETWORK_ID].Token.address);

    return true;

    }
   
    function setWeb3event (_provider) {

        _provider.on("accountsChanged", (accounts)=> {
            console.log(accounts);
            if(!accounts.length){
                logout();

            } else {
                currentAddress = accounts[0];
                let SClass = getSelectedTab();
            }

          });

          //subscrieb to chainId
          _provider.on("chainChanged", (chainId) => {
            console.log(chainId);
            logout();

          });

          //subscribe to session connection
          _provider.on("connect", () => {
            console.log("connect");
            logout();

          });

          // Subscribe to session disconnection

          _provider.on("disconnect", (code, reason)=>{
              console.log(code, reason);
               localStorage.clear();
               logout();
          });
}


  function logout(){

     window.location.reload();
  }

  //Function that converts ether to Wei
  function addDecimal(num, nDec){     
    const aNum =  `${num}`.split(",");
      if(aNum[1]){
          if(aNum[1]) {
              if(aNum[1].length > nDec) aNum[1].slice(0, nDec);
              return aNum[0] + aNum[1] + "0".repeat(nDec - aNum[1].length);

          }

          return aNum[0] + "0".repeat(nDec);
      }
  }

  //Format Error Message
function formatEthErrorMsg(error){

    try{
        var eFrom = error.message.indexOf("{");
        var eTo = error.message.lastIndexOf("}");
        var eM1 = error.message.indexOf("TokenStaking:");
        var eM2 = error.message.indexOf("ERC20:");
        var eM4 = error.message.indexOf("Internal JSON-RPC error");

        if(eFrom != -1 && eTo != -1 && (eM1 != -1 || eM2 != -1)){
              var eMsgTemp = JSON.parse(error.message.substr(eFrom, eTo));
              var eMsg = eM4 != -1 ? eMsgTemp.message : eMsgTemp.originalError.message;

            if(eM1 != -1){
                 return eMsg.split("TokenStaking: ")[1];

            }else{
                return eMsg.split("ERC20: ")[1];
            }
        }else{
            return error.message;
        }
    } catch(e){
        console.log(e);
        return "Something went wrong"
    }
}


function getSelectedTab(sClass){
     console.log(sClass);
     return sClass || contractCall;
}

function getContractObj(sClass){
     return new web3.eth.Contract(SELECT_CONTRACT[_NETWORK_ID].STACKING.abi, SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address);
}










 */




async function commonProviderDetector(_provider) {
    if (_provider === "metamask_wallet") {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                
                // await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // return await commonInjectedConnect(window.ethereum, _provider);
            

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Once accounts are obtained, proceed with commonInjectedConnect
                return await commonInjectedConnect(window.ethereum, _provider);
            
            } catch (error) {
                console.log("User denied account access or something went wrong:", error);
                return false;
            }
        } else {
            console.log("MetaMask wallet not found");
            window.open("https://metamask.io/download", "_blank").focus();
            return false;
        }
    }
}

// async function commonInjectedConnect(_provider, _provider_name) {
//     try {
//         await _provider.enable();

//         setWeb3event(_provider);
        
//         web3 = new Web3(_provider);

//         let currentNetworkId = await web3.eth.getChainId();

//         currentNetworkId = currentNetworkId.toString();

//         console.log("network", currentNetworkId);

//         console.log("networkid", _NETWORK_ID);

//         const accounts = await web3.eth.getAccounts();

//         console.log("-> accounts", accounts);

//         currentAddress = accounts[0].toLowerCase();

//         //const currentNetworkId = await web3.eth.getChainId();


//         //if (currentNetworkId.toString() != _NETWORK_ID) {


//         if (currentNetworkId  != _NETWORK_ID) {
//             //console.log(_NETWORK_ID);
//             //console.log(currentNetworkId);
//             notyf.error(`Please connect wallet on ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`);
//             return false;
//         }
//         onContractToken = new web3.eth.Contract(SELECT_CONTRACT[_NETWORK_ID].TOKEN.abi, 
//                                                 SELECT_CONTRACT[_NETWORK_ID].TOKEN.address);
//         return true;
//     } catch (error) {
//         console.error("Error connecting with the injected provider:", error);
//         return false;
//     }
// }

// async function commonInjectedConnect(_provider, _provider_name) {
//     try {
//         await _provider.enable();
//         setWeb3event(_provider);
//         web3 = new Web3(_provider);
//         const accounts = await web3.eth.getAccounts();
//         console.log("-> accounts", accounts);
//         currentAddress = accounts[0].toLowerCase();
//         const currentNetworkId = await web3.eth.getChainId();
//         console.log("-> currentNetworkId", currentNetworkId);
        
//         if (currentNetworkId.toString() !== _NETWORK_ID.toString()) {
//             console.error("Current network ID:", currentNetworkId.toString(), "Expected network ID:", _NETWORK_ID.toString());
//             notyf.error(`Please connect wallet on ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`);
//             return false;
//         }

//         onContractToken = new web3.eth.Contract(SELECT_CONTRACT[_NETWORK_ID].STACKING.abi, SELECT_CONTRACT[_NETWORK_ID].STACKING.sevenDays.address);
//         return true;
//     } catch (error) {
//         console.error("Error connecting with the injected provider:", error);
//         return false;
//     }
// }



async function commonInjectedConnect(_provider, _provider_name) {
    try {
        await _provider.enable();
        setWeb3event(_provider);
        web3 = new Web3(_provider);
        let currentNetworkId = await web3.eth.getChainId();
        currentNetworkId = currentNetworkId.toString();
        console.log("network", currentNetworkId);
        console.log("networkid", _NETWORK_ID);
        const accounts = await web3.eth.getAccounts();
        console.log("-> accounts", accounts);
        
        // Check if accounts array is empty
        if (accounts.length === 0) {
            console.error("No accounts found.");
            return false;
        }
        
        currentAddress = accounts[0].toLowerCase();

        console.log(currentAddress);
        
        if (currentNetworkId != _NETWORK_ID) {
            notyf.error(`Please connect wallet on ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`);
            return false;
        }
        
        oContractToken = new web3.eth.Contract(SELECT_CONTRACT[_NETWORK_ID].TOKEN.abi, 
                                                SELECT_CONTRACT[_NETWORK_ID].TOKEN.address);
        return true;
    } catch (error) {
        console.error("Error connecting with the injected provider:", error);
        return false;
    }
}





function setWeb3event(_provider) {
    _provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
        if (!accounts.length) {
            logout();
        } else {
            currentAddress = accounts[0];
            let SClass = getSelectedTab();
        }
    });

    _provider.on("chainChanged", (chainId) => {
        console.log(chainId);
        logout();
    });

    _provider.on("connect", () => {
        console.log("connect");
        logout();
    });

    _provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        localStorage.clear();
        logout();
    });
}

function logout() {
    window.location.reload();
}

// Function that converts ether to Wei
function addDecimal(num, nDec) {
    const aNum = `${num}`.split(",");
    if (aNum[1]) {
        if (aNum[1].length > nDec) aNum[1].slice(0, nDec);
        return aNum[0] + aNum[1] + "0".repeat(nDec - aNum[1].length);
    }
    return aNum[0] + "0".repeat(nDec);
}

// Format Error Message
function formatEthErrorMsg(error) {
    try {
        var eFrom = error.message.indexOf("{");
        var eTo = error.message.lastIndexOf("}");
        var eM1 = error.message.indexOf("TokenStaking:");
        var eM2 = error.message.indexOf("ERC20:");
        var eM4 = error.message.indexOf("Internal JSON-RPC error");

        if (eFrom != -1 && eTo != -1 && (eM1 != -1 || eM2 != -1)) {
            var eMsgTemp = JSON.parse(error.message.substr(eFrom, eTo));
            var eMsg = eM4 != -1 ? eMsgTemp.message : eMsgTemp.originalError.message;

            if (eM1 != -1) {
                return eMsg.split("TokenStaking: ")[1];
            } else {
                return eMsg.split("ERC20: ")[1];
            }
        } else {
            return error.message;
        }
    } catch (e) {
        console.log(e);
        return "Something went wrong";
    }
}

// function getSelectedTab(sClass) {
//     console.log(sClass);
//     return sClass || contractCall;
// }

function getSelectedTab(sClass) {
    console.log(sClass);
    return contractCall;
}

// function getSelectedTab(sClass) {
//     if (typeof sClass !== 'undefined') {
//         console.log(sClass);
//         return sClass;
//     }
//     console.log("sClass is undefined. Returning default value.");
//     return contractCall; // Assuming contractCall is a valid default value
// }


function getContractObj(sClass) {
    return new web3.eth.Contract(
        SELECT_CONTRACT[_NETWORK_ID].STACKING.abi, 
        SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address);
}
