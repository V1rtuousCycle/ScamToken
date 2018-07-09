import React, { Component } from "react";
import Crowdfunding from "../build/contracts/Crowdfunding.json";
import ScamToken from '../build/contracts/ScamToken.json';
const contract = require("truffle-contract");
import getWeb3 from "./utils/getWeb3";

export default class CrowdfundingContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icoStatus: null,
      account: null,
      purchaseField: 0,
      claimableBalance: "Loading",
      totalRaised: null,
      scmBalance: 0,
    };

    this.instantiateCrowdfunding = this.instantiateCrowdfunding.bind(this);
    this.allowTransfers = this.allowTransfers.bind(this);
    this.retrieveICOStatus = this.retrieveICOStatus.bind(this);
    this.purchaseSCM = this.purchaseSCM.bind(this);
    this.claimSCM = this.claimSCM.bind(this);
    this.handlePurchaseField = this.handlePurchaseField.bind(this);
    this.claimableBalance = this.claimableBalance.bind(this);
    this.totalRaised = this.totalRaised.bind(this);
    this.instantiateScamToken = this.instantiateScamToken.bind(this);
    this.scamTokenBalance = this.scamTokenBalance.bind(this);
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
                this.instantiateCrowdfunding();
                this.allowTransfers();
                setInterval(this.retrieveICOStatus, 1000);
                setInterval(this.claimableBalance, 1000);
                setInterval(this.totalRaised, 1000);
                setInterval(this.scamTokenBalance, 1000);
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

  handlePurchaseField(e) {
    e.preventDefault();
    this.setState({
      purchaseField: e.target.value
    });
  }

  instantiateCrowdfunding() {
    let crowdfundingContract = contract(Crowdfunding);
    crowdfundingContract.setProvider(this.state.web3.currentProvider);
    return crowdfundingContract.deployed();
  }

  instantiateScamToken() {
    let scamTokenContract = contract(ScamToken);
    scamTokenContract.setProvider(this.state.web3.currentProvider);
    return scamTokenContract.deployed();
  }

  // Allows the auction access to their funds. <Thumbs Up>
  allowTransfers() {
    const crowdfundingInstance = this.instantiateCrowdfunding;
    crowdfundingInstance().then(contract => {
      this.props.weth().then(wethInstance => {
        var allowed = wethInstance.allowance
          .call(this.state.account, contract.address, {
            from: this.state.account
          })
          .then(result => {
            return result.toString(10);
          })
          .then(allowance => {
            if (allowance < this.state.web3.toWei("1000", "ether")) {
              return wethInstance
                .approve(
                  contract.address,
                  this.state.web3.toWei("10000", "ether"),
                  {
                    from: this.state.account
                  }
                )
                .then(res => {
                  console.log("approval response", res);
                })
                .catch(err => {
                  console.log("Weth instance never approved the ICO address.");
                });
            }
          });
      });
    });
  }

  retrieveICOStatus() {
    const crowdfundingInstance = this.instantiateCrowdfunding;
    crowdfundingInstance().then(contract => {
      contract.active().then(result => {
        if (result === true) {
          this.setState({
            icoStatus: "ACTIVE"
          });
        } else {
          this.setState({
            icoStatus: "FINISHED"
          });
        }
      });
    });
  }

  purchaseSCM() {
    this.instantiateCrowdfunding().then(contract => {
      // let trueEtherValue = this.state.web3.toWei(
      //   this.state.purchaseField,
      //   "ether"
      // );
      // console.log(typeof trueEtherValue, "trueETH", trueEtherValue);
      console.log(this.state.purchaseField, typeof this.state.purchaseField);
      contract
        .purchase(this.state.web3.toWei(this.state.purchaseField, "ether"), {
          from: this.state.account
        })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log("Something went wrong purchasing ICO tokens");
        });
    });
  }

  claimSCM() {
    this.instantiateCrowdfunding().then(contract => {
      contract
        .withdraw({
          from: this.state.account
        })
        .then(result => {
          console.log(result);
        });
    });
  }

  claimableBalance() {
    this.instantiateCrowdfunding()
      .then(contract => {
        return contract.balances(this.state.account);
      })
      .then(balance => {
        if (typeof balance === "object") {
          balance = balance.toNumber() * 10;
        }
        balance = this.state.web3.fromWei(balance, 'ether');
        this.setState({
          claimableBalance: balance
        });
      })
      .catch(err => {
        "Unable to get the balance";
      });
  }

  totalRaised() {
    this.instantiateCrowdfunding()
      .then(crowdfundingInstance => {
        return crowdfundingInstance.totalWeiRaised();
      })
      .then(totalRaised => {
        totalRaised = totalRaised.toString(10);
        totalRaised = this.state.web3.fromWei(totalRaised, 'ether');
        this.setState({
          totalRaised: totalRaised
        });
      });
  }

  scamTokenBalance() {
    this.instantiateScamToken()
    .then(scamTokenInstance => {
      scamTokenInstance.balanceOf.call(this.state.account, {
        from: this.state.account
      })
      .then(balance => {
        balance = balance.toString(10);
        this.setState({
          scmBalance: balance,
        })
      })
    })
  }

  render() {
    return (
      <div>
        <h2>Participate in ICO for Super Compounding Money</h2>
        <p>
          <b>ICO Status: {this.state.icoStatus || "Uknown"}</b>.{" "}
          <em>
            (The auction will complete once 1000 ETH have been raised. 
          </em>)
        </p>

        <input
          type="text"
          onChange={this.handlePurchaseField}
          value={this.state.purchaseField}
        />
        <button onClick={this.purchaseSCM}>Purchase SCM Tokens</button>
        <p> Total ETH Raised: {this.state.totalRaised || "Unknown"}</p>
        <p>
          Claimable Balance: {this.state.claimableBalance} / 10000 SCM Tokens. <em>(Balance
            is only claimable once the ICO Status is: FINISHED)</em>
        </p>
        <h2>Claim Tokens</h2>
        <button onClick={this.claimSCM}>Claim SCM Tokens!</button>
        <hr/>
        <p>Your SCM Token Balance: {this.state.scmBalance}</p>
      </div>
    );
  }
}
