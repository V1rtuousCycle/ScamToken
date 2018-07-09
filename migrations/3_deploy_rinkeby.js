const ScamToken = artifacts.require("ScamToken");
const Crowdfunding = artifacts.require("Crowdfunding");

// deploy ICO contract passing in the address of the ScamToken contract,
// and transferring the tokens to the ICO contract (is approve vs transfer gas costs a valid consideration?)
module.exports = (deployer, network, accounts) => {
  deployer.deploy(ScamToken).then(instance => {
    var scmTokenInstance = instance;
    return deployer.deploy(Crowdfunding, instance.address, 0xc778417E063141139Fce010982780140Aa0cD5Ab).then(instance => {
      crowdFundingInstance = instance;
      return scmTokenInstance.transfer(
        crowdFundingInstance.address,
        1000000000000000000000
      );
    });
  });
};
