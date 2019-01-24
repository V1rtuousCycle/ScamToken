# ScamToken
A token sale raising Wrapped Ether for SCM token. Implementing an ERC20 interface for the SCM token via the ScamToken.sol contract, and holding a Crowdsale (ICO) event via the Crowdfunding.sol contract. A React interface is built  

## Note
The EthPM registry was down when I was creating this project (Jan 23rd, 2019). So, I was not able to include a package from it. (Although I have many times in the past, we have tried using it as Gnosis, and it didn't work out,as libraries could dissapear due to IPFS not having Proof-of-Replication implemented yet.) Screenshots to verify that EthPM was down are included in the root folder of this project 

## How to interact
Run `npm run start` and buy some WETH tokens from the already deployed contracts hosted on the Rinkeby network. _The app should automatically start on localhost:3000._
The greatest thing about web3.0 is that we can interact with the Blockchain from *localhost*, without ever deploying the project. 

To compile the contracts, similary use `npx truffle compile --all` or use a Solidity 0.4.x BYOC version with Truffle.

### Testing
Make sure to run `npx truffle test` after running `npm i` to install node_modules, as this project was built using Truffle v4.1.5, and will not be compatible with `truffle test` if you have a globally installed Truffle v5.0.

The tests have been written to verify thhe functionality of the `ScamToken` and `Crowdfunding` contracts in a controlled environment. 

### Deployed Network Addresses (Network Extraction / Injection)
To extract and inject the newtowrk addresses from your smart contracts, use the `@gnosis.pm/truffle-nice-tools` package command `npx tnt injectNetworks` and `npx tnt extractNetworks`. Which will appear in the _networks.json_ file in the root directory.
