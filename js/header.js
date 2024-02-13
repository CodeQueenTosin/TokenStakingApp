const _NETWORK_ID = 80001;

let SELECT_NETWORK = {};

SELECT_CONTRACT [_NETWORK_ID] = {
     network_name: "Polygon Mumbai",
     explorer_url: "https://mumbai.polygonscan.com",
     STACKING: {
        //Aaddress
        sevenDays: {
            address: "0x51168d2D1B935932959Bd7617892a5C1SB7Fb0AA"
        },

        tenDays: {
            address: "0X18E6d0eb4Cf368b4089BdEE8158a46EAF5003aA3",

        }, 
        thirtyTwoDays: {
             address: "0X18E6d0eb4Cf368b4089BdEE8158a46EAF5003aA3"
        },
        ninetyDays: {
             address:"0X18E6d0eb4Cf368b4089BdEE8158a46EAF5003aA3"
        },
        abi: [],

     },
      TOKEN: {
          symbol: "TBC",
          address: "0x51168d2D1B935932959Bd7617892a5C1SB7Fb0AA",
          abi: [],
      },
    
};

//Countdown Global
let countDownGlobal;

let web3;

let oContractToken;

let contractCall = "sevenDays";

let currentAddress;

let web3Main = new web3("https://rpc.ankr.com/polygon_mumbai");

//Create an Instance of Notyfy

var notyf = new Notyf({
    duration: 300,
    position: {
        x: "right", y: "bottom"
    }
});







