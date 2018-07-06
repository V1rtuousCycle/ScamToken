import React, { Component } from "react";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import WethContract from "../build/contracts/WETH9.json";
import ScamToken from '../build/contracts/ScamToken.json';
import ScamTokenData from './SCMTokenData.js';
import Crowdfunding from './Crowdfunding.js'
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";
import SCMTokenData from "./SCMTokenData.js";

const contract = require("truffle-contract");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      weth: {
        balance: null,
        ethBalance: null,
        depositField: 0
      },
      scm: {
        balance: 0,
        claimable: 0
      },
      icoStatus: false,
      web3: null,
      wethBalance: null
    };

    this.instantiateContract = this.instantiateContract.bind(this);
    this.instantiateWeth = this.instantiateWeth.bind(this);
    this.purchaseWeth = this.purchaseWeth.bind(this);
    this.getWethBalance = this.getWethBalance.bind(this);
    this.depositWethFieldChange = this.depositWethFieldChange.bind(this);
    this.convertFromWei = this.convertFromWei.bind(this);
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
     
            this.setState(
              {
                account: this.state.web3.eth.accounts[0]
              },
              () => {
                this.instantiateContract();
                this.instantiateWeth();
                this.getWethBalance();
                setInterval(this.getWethBalance, 3000);
              }
            );
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

  instantiateWeth() {
    const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
    let truffleWethContract = contract(WethContract);
    truffleWethContract.setProvider(this.state.web3.currentProvider);
    let wethInstance;
    return truffleWethContract.at(WETH_ADDRESS).then(instance => instance);
  }

  depositWethFieldChange(e) {
    e.preventDefault();
    this.setState({
      weth: {
        ...this.state.weth,
        depositField: e.target.value
      }
    });
    console.log(typeof this.state.weth.depositField);
  }

  purchaseWeth() {
    var instance = this.instantiateWeth;
    instance()
      .then(wethInstance => {
        return wethInstance.deposit({
          from: this.state.account,
          value: this.state.weth.depositField
        })
      })
      .then((res) => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getWethBalance() {
    var instance = this.instantiateWeth;
    instance()
      .then(wethInstance => {
        return wethInstance.balanceOf(this.state.account);
      })
      .then(balances => {
        return balances.toNumber();
      })
      .then(result => {
        var ethResult = this.state.web3.fromWei(result, 'ether');
        this.setState({
          weth: {
            ...this.state.weth,
            balance: result,
            ethBalance: ethResult,
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  convertFromWei(wei) {
    if (this.state.web3) {
      return this.state.web3.fromWei(wei, 'ether');
    } else {
      return false;
    }
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Your account: {this.state.account}
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>SCM Token (Super Compounding Money) ICO</h1>
              <p>WETH Balance: {this.state.weth.balance || "Loading"} Wei. --- {this.state.weth.ethBalance || "Loading"} Ether.</p>
              <input type="text" placeholder="What amount?" onChange={this.depositWethFieldChange} value={this.state.weth.depositField}/>
              <button onClick={this.purchaseWeth}>Buy Weth</button>
              <SCMTokenData scm={this.state.scm}/>
              <Crowdfunding weth={this.instantiateWeth}/>
              
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
