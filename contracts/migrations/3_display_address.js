const Circle = artifacts.require("SavingCircle");

module.exports = function (deployer, network, accounts) {
  return deployer.then(async () => {
    const circ = await Circle.deployed();
    console.log(`Circle address ${circ.address}`);
  });
};
