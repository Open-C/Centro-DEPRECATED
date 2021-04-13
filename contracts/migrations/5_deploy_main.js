const Centro = artifacts.require("CentroMain");
const Storage = artifacts.require("Storage");
const Wallet = artifacts.require("CentroWallet");
const MoolaC = artifacts.require("MoolaConnector");
const ExchangeC = artifacts.require("ExchangeConnecter");

module.exports = function (deployer, network, accounts) {
  return deployer.then(async () => {
    const store = await Storage.deployed();
    store.init(["0xe3764321f5E5b236B9899778DbFbf0bA039af9c7", ...accounts]);
    const centro = await deployer.deploy(Centro, store.address);
    store.setArboAddr(centro.address);
    const moola = await deployer.deploy(MoolaC);
    const exchange = await deployer.deploy(ExchangeC);
    store.addConnector("moola", moola.address);
    store.addConnector("exchange", exchange.address);
    const wallet = await deployer.deploy(Wallet, accounts[0], store.address);
    console.log(centro.address);
  });
};
