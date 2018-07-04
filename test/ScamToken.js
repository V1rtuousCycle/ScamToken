var Crowdfunding = artifacts.require("./ScamToken.sol");

// instantiate a call to WETH, how?
// approve a certain amount of WETH towards Crowdfunding address
// test that the purchase method returns the proper balances
contract('SCMToken', function(accounts) {
    // It should 
    it("...should accept payment via WETH only", function() {
        // try sending the contract some ETHER and see if it reverts
    });

    it("...should pay out SCM tokens only after the crowdsale is complete", function() {
        // try withdrawing while the contract is still open and see if it works
    });
});