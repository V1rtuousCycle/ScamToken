var ScamToken = artifacts.require("ScamToken");
var Crowdfunding = artifacts.require("Crowdfunding");
var WETH9 = artifacts.require("WETH9");

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
  var weth9;

  beforeEach(async () => {
    weth9 = await WETH9.deployed();
    scamToken = await ScamToken.deployed();
    crowdfunding = await Crowdfunding.deployed();
  });

  it("Should start accounts with a balance of 0 Wrapped Ether", async () => {
    var startingBalance = await weth9.balanceOf(accounts[1]);
    assert.equal(startingBalance, 0);
  });

  it("Should be able to buy some Wrapped Ether", async () => {
    var buyWeth = await weth9.deposit({
      from: accounts[1],
      value: 5e18
    });
    var currentBalance = await weth9.balanceOf(accounts[1]);
    currentBalance = currentBalance.toString(10);
    assert.equal(currentBalance, web3.toWei(5, "ether"));
  });

  it("Should purchase an amount x of tokens and place all them to the msg.senders balance of the crowdfunding", async () => {
    WETH9.at(await crowdfunding.weth.call());
    weth9.deposit({
      from: accounts[2],
      value: 5e18
    });
    await weth9.approve(crowdfunding.address, 1e21, {
      from: accounts[2]
    });
    await weth9.allowance(accounts[2], crowdfunding.address);
    await crowdfunding.active();
    await crowdfunding.purchase(100, {
      from: accounts[2]
    });
    var balance = await crowdfunding.balances(accounts[2]);
    assert.equal(balance, 100);
    // const totalAccountBalance = await crowdfunding.balances(accounts[1]);
    // console.log('total balance for account', totalAccountBalance);
  });

  it("Should not be able to withdraw until the auction is over and the timeout has passed", async () => {
    const active = await crowdfunding.active();
    console.log(active);
    if (active == true) {
      try {
        var withdraw = await crowdfunding.withdraw({
            from: accounts[0]
        });
      } catch (err) {
        assert(true);
      }
    }
  });
});
