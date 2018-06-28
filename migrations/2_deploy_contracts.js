var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var StandardToken = artifacts.require("./StandardToken.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(StandardToken);
};
