var StandardToken = artifacts.require("./StandardToken.sol");
var SCMToken = artifacts.require("./SCMToken.sol");

contract('StandardToken', function(accounts) {
  it("...should return the balance of 0", function() {
    return StandardToken.deployed()
    .then(function(instance) {
        standardTokenInstance = instance;
        return standardTokenInstance.totalSupply();
    }).then(function(totalSupply) {
        assert.equal(
          totalSupply,
          1000,
          "The value of totalSupply was not stored."
        );
      });
  });
});
