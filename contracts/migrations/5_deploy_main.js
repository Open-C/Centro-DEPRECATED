const Centro = artifacts.require("CentroMain");
const Storage = artifacts.require("Storage");
const Wallet = artifacts.require("CentroWallet");
const MoolaC = artifacts.require("MoolaConnector");
const ExchangeC = artifacts.require("ExchangeConnector");

module.exports = function (deployer, network, accounts) {
	return deployer.then(async () => {
		const store = await Storage.deployed();
		store.init(["0xe3764321f5E5b236B9899778DbFbf0bA039af9c7", ...accounts]);
		const centro = await deployer.deploy(Centro, store.address);
		store.setCentroAddr(centro.address);
		store.newAddressProvider(
			"moola",
			"0x6EAE47ccEFF3c3Ac94971704ccd25C7820121483"
		);
		const moola = await deployer.deploy(MoolaC);
		const exchange = await deployer.deploy(ExchangeC);
		store.addConnector("moola", moola.address);
		store.addConnector("exchange", exchange.address);
		const wallet = await deployer.deploy(Wallet, accounts[0], store.address);
		console.log(centro.address);
	});
};
