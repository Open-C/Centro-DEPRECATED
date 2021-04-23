var ExchangeConnector = artifacts.require("ExchangeConnector");

module.exports = function (deployer) {
	deployer.deploy(ExchangeConnector);
};
