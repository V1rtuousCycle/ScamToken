import React, { Component } from "react";
import PropTypes from "prop-types";
import Crowdfunding from "../build/contracts/Crowdfunding.json";
const contract = require("truffle-contract");
import getWeb3 from "./utils/getWeb3";

export default class CrowdfundingContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
        icoStatus: null,
        account: null,
    };

    this.instantiateCrowdfunding = this.instantiateCrowdfunding.bind(this);
    this.allowTransfers = this.allowTransfers.bind(this);
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
  

  instantiateCrowdfunding() {
    let crowdfundingContract = contract(Crowdfunding);
    crowdfundingContract.setProvider(this.state.web3.currentProvider);
    return crowdfundingContract.deployed()
    .then(contract => {
        return crowdfundingContract
    })
    .catch(err => {
        console.log(`Failed to instantiate Crowdfunding contract with: ${err}`);
    })
  }

  allowTransfers() {
      const crowdfundingInstance = this.instantiateCrowdfunding;
      crowdfundingInstance()
      .then(contract => {
         this.props.weth()
         .then(wethInstance => {
             console.log(wethInstance);
             return wethInstance.approve(contract.address, 1000000000000000000000000, {
                 from: this.state.account,
             })
             .then(res => {
                 console.log('approval response', res);
             })
             .catch(err => {
                 console.log('Weth instance never approved the ICO address.');
             })
         })
      })
  }

 

  render() {
    return (
      <div>
        <input type="text" placeholder="Deposit Weth" />
        <button>Purchase SCM Tokens</button>
        <p>ICO Status: {this.state.icoStatus || "Uknown"}</p>
        <button>Claim SCM Tokens!</button>
      </div>
    );
  }
}
