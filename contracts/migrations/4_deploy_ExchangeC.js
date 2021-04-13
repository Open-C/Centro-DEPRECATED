var ExchangeC = artifacts.require("ExchangeConnector");

module.exports = function (deployer) {
  deployer.deploy(ExchangeC);
};
