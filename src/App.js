import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import WethContract from "../build/contracts/WETH9.json";
import Crowdfunding from "./Crowdfunding.js";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

const contract = require("truffle-contract");
const styles = {
  inline: {
    display: 'inline'
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      balance: null,
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

    this.instantiateWeth = this.instantiateWeth.bind(this);
    this.purchaseWeth = this.purchaseWeth.bind(this);
    this.getWethBalance = this.getWethBalance.bind(this);
    this.depositWethFieldChange = this.depositWethFieldChange.bind(this);
    this.convertFromWei = this.convertFromWei.bind(this);
    this.getEthBalance = this.getEthBalance.bind(this);
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
                const { web3 } = this.state;
                this.instantiateWeth();
                setInterval(this.getWethBalance, 3000);
                this.getWethBalance();
                this.getEthBalance(this.state.account);
              }
            );
          }
        );
        // Instantiate contracts once web3 provided.
      })
      .catch(() => {
        alert(`No fucking Metamask.
        Please download it here bro: https://metamask.io/
        This is not a scam.
        `);
      });
  }

  instantiateWeth() {
    const WETH_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab";
    let truffleWethContract = contract(WethContract);
    truffleWethContract.setProvider(this.state.web3.currentProvider);
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
  }

  purchaseWeth() {
    var instance = this.instantiateWeth;
    instance()
      .then(wethInstance => {
        const trueEtherValue = this.state.web3.toWei(
          this.state.weth.depositField,
          "ether"
        );
        return wethInstance.deposit({
          from: this.state.account,
          value: trueEtherValue
        });
      })
      .then(res => {
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
        return wethInstance.balanceOf(this.state.web3.eth.accounts[0]);
      })
      .then(balances => {
        return balances.toNumber();
      })
      .then(result => {
        var ethResult = this.state.web3.fromWei(result, "ether");
        if (typeof ethResult === "object") {
          ethResult = ethResult.toNumber();
        }
        this.setState({
          weth: {
            ...this.state.weth,
            balance: result,
            ethBalance: ethResult
          }
        });
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  }

  convertFromWei(wei) {
    if (this.state.web3) {
      return this.state.web3.fromWei(wei, "ether");
    } else {
      return false;
    }
  }

  async getEthBalance(account) {
    if (this.state.web3) {
      this.state.web3.eth.getBalance(account, (err, res) => {
        if (err) {
          console.log(err);
        }
        var result = this.state.web3.fromWei(res.toString(), 'ether');
        this.setState({
          balance: result
        });
      });
    }
  }

  render() {
    const { web3, balance, weth } = this.state;
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Your account: {this.state.account} ---- Current Balance: {balance} ETH 
          </a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>SCM Token (Super Compounding Money) ICO</h1>
              <hr/>
              <p>
                WETH Balance: {weth.balance || "Loading"} Wei. ---{" "}
                {weth.ethBalance || "Loading"} Ether.
              </p>
              <label htmlFor="purchaseWeth">Convert ETH into WETH: </label>
              <input
                id="purchaseWeth"
                type="text"
                placeholder="What amount?"
                onChange={this.depositWethFieldChange}
                value={weth.depositField}
              />
              <button style={styles.inline} onClick={this.purchaseWeth}>Buy Weth</button>
              <Crowdfunding weth={this.instantiateWeth} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
