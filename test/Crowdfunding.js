var Crowdfunding = artifacts.require("./Crowdfunding.sol");

// instantiate a call to WETH, how?
// approve a certain amount of WETH towards Crowdfunding address
// test that the purchase method returns the proper balances
contract('Crowdfunding', function(accounts) {
    it("...should accept payment via WETH only", function() {
        return Crowdfunding.deployed().then(function(instance) {
            
        })
    });
});