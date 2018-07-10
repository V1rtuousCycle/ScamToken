const ScamToken = artifacts.require("ScamToken");
const Crowdfunding = artifacts.require("Crowdfunding");
const WETH9 = artifacts.require("WETH9");
// deploy ICO contract passing in the address of the ScamToken contract,
// and transferring the tokens to the ICO contract (is approve vs transfer gas costs a valid consideration?)
module.exports = (deployer, network, accounts) => {
  if (network == "rinkeby") {
    deployer.deploy(ScamToken).then(instance => {
      var scmTokenInstance = instance;
      return deployer
        .deploy(
          Crowdfunding,
          instance.address,
          "0xc778417e063141139fce010982780140aa0cd5ab"
        )
        .then(instance => {
          crowdFundingInstance = instance;
          return scmTokenInstance.transfer(
            crowdFundingInstance.address,
            1000000000000000000000
          );
        });
    });
  } else if (network == "ganache") {
    deployer.deploy(WETH9).then(weth9Instance => {
      return deployer.deploy(ScamToken).then(instance => {
        var scmTokenInstance = instance;
        return deployer
          .deploy(Crowdfunding, scmTokenInstance.address, weth9Instance.address)
          .then(instance => {
            crowdFundingInstance = instance;
            return scmTokenInstance.transfer(
              crowdFundingInstance.address,
              1000000000000000000000
            );
          });
      });
    });
  }
};
