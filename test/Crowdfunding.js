var ScamToken = artifacts.require("ScamToken");
var Crowdfunding = artifacts.require("Crowdfunding");

contract("ScamToken", function(accounts) {
    var scamToken;
    var crowdfunding;

  before(async () => {
    scamToken = await ScamToken.deployed();
    crowdfunding = await Crowdfunding.deployed();
  });

  it("Should have a balance of 10^21 Scam Tokens initially.", async () => {
    var balance = await scamToken.balanceOf.call(crowdfunding.address);
    balance = balance.toString(10);
    assert.equal(balance, 1e21);
  });

  it("Should have a total supply of 10^21 Scam Tokens.", async () => {
    var totalSupply = await scamToken.totalSupply();
    totalSupply = totalSupply.toString(10);
    assert.equal(totalSupply, 1e21);
  });

  it("Expects a revert in the smart contract if transferFrom isn't allowed first", async () => {
    try {
      var transferFromResult = await scamToken.transferFrom(
        accounts[3],
        accounts[4],
        100
      );
    } catch (err) {
      assert(true);
    }
  });

  it("Expects the initial balance of an account to be 0", async () => {
    var balance = await scamToken.balanceOf.call(accounts[0]);
    assert.equal(balance, 0);
  });


});

contract("Crowdfunding", function(accounts) {
  var scamToken;
  var crowdfunding;

  before(async () => {
    scamToken = await ScamToken.deployed();
    crowdfunding = await Crowdfunding.deployed();
  });

  it("Should purchase an amount x of tokens and all them to the msg.senders balance", async () => {
    
  });
});
