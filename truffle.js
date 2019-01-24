module.exports = {
  networks: {
    rinkeby: {
      host: '127.0.0.1',
      port: 8545,
      from: '0x486156834261013e9a4f417c9f637fa983ea4026', // input your address
      network_id: "4",
      gas: 4000000,  // Gas limit used for deploys  
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
