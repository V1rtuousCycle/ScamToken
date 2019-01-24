require('dotenv').config();

var HDWalletProvider = require("truffle-hdwallet-provider");

const seed = process.env.SEED || 'witch collapse practice feed shame open despair creek road again ice least' 


module.exports = {
  networks: {
    rinkeby: {
      provider: () => {
       return new HDWalletProvider(seed, "https://rinkeby.infura.io/v3/22218302c99b4ee29f8a5876ad0b552c"); 
      }, 
      network_id: "4"
    },
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      from: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', // input your address
      gas: 4000000, // Gas limit used for deploys  
      network_id: "*" // Match any network id
    }
  }
};