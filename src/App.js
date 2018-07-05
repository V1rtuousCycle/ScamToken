import React, { Component } from "react";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import WethContract from "../build/contracts/WETH9.json";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

const contract = require("truffle-contract");

// Material UI
import Button from "@material-ui/core/Button";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weth: {
        balance: 0
      },
      scm: {
        balance: 0,
        claimable: 0
      },
      icoStatus: false,
      web3: null,
      wethBalance: null
    };

    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    this.instantiateContract = this.instantiateContract.bind(this);
    this.instantiateWeth = this.instantiateWeth.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(results => {
        this.setState(
          {
            web3: results.web3
          },
          () => {
            this.instantiateContract();
            this.instantiateWeth();
          }
        );
        // Instantiate contracts once web3 provided.
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .deployed()
        .then(instance => {
          simpleStorageInstance = instance;
          console.log("simpleStorageInstance", simpleStorageInstance);
          // Stores a given value, 5 by default.
          return simpleStorageInstance.set(5, { from: accounts[0] });
        })
        .then(result => {
          // Get the value from the contract to prove it worked.
          return simpleStorageInstance.get.call(accounts[0]);
        })
        .then(result => {
          // Update state with the result.
          return this.setState({ storageValue: result.c[0] });
        });
    });
  }

  async instantiateWeth() {
    const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";

    let truffleWethContract = contract(WethContract);
    truffleWethContract.setProvider(this.state.web3.currentProvider);

    let wethInstance;

    truffleWethContract.at(WETH_ADDRESS).then(instance => {
      wethInstance = instance;
      console.log("truffleWethContract", wethInstance);
      return wethInstance.totalSupply.call().then(totalSupply => {
        console.log("totalSupply", totalSupply.toNumber());
      });
    });

    // Access the canonical deployed WETH contract on Rinkeby through the web3 API
    // const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
    // let wethInstance = await this.state.web3.eth.contract(ABI).at(WETH_ADDRESS);
    // console.log('weth instance', wethInstance);
    // var accounts = await this.state.web3.eth.accounts;
    // console.log('accounts', accounts);
    // return wethInstance.approve.call(accounts[0], 500)
    // .then((result) => {
    //   console.log('call result', result);
    // })

    // this.state.web3.eth.getAccounts((err, accounts) => {
    //   if (!err) {

    //   }
    // })
    // let name = await wethInstance.balanceOf((err, data) => {
    //   if (!err) {
    //     console.log(data.toNumber());
    //   }
    // })
    // let approve = await wethInstance.approve("0x2624d45cA77c065999d2328b3e8f2D7Bc53a5779", 50, (err, data) => {
    //   console.log(data);
    // })
    // this.state.web3.eth.getBalance("0x2624d45cA77c065999d2328b3e8f2D7Bc53a5779", (err, res) => {

    //   console.log(this.state.web3.fromWei(res.toNumber(), 'ether'));
    // });
  }

  render() {
    const { web3 } = this.state;
    console.log("WEB3!!!", web3);
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            SCM Token ICO
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>SCM Token (Super Compounding Money) ICO</h1>
              <p>WETH Balance: {this.state.wethBalance}</p>
              <p>SCM Balance: {this.state.scmBalance}</p>
              <p>SCM Balance to Claim: {this.state.scmBalanceClaimable}</p>
              <Button
                variant="contained"
                color="primary"
              >
                Primary
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
