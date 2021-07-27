import { DeployFunction, getDeployment } from ".";
import { ethers } from "hardhat";
import { ICeloNetwork, doTx } from "@ubeswap/hardhat-celo";

export const deployEventEmitter: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  const deployerAddress = await deployer?.getAddress();
  console.log(`Deploying from address: ${deployerAddress}`);

  const chainId = env.network.config.chainId || ICeloNetwork["ALFAJORES"];
  const storageAddress =
    (await getDeployment("Storage", chainId))["Storage"] || "0x0";

  const EventEmitter = await ethers.getContractFactory("EventEmitter");
  const Storage = await ethers.getContractFactory("Storage");
  const eventEmitter = await EventEmitter.deploy(storageAddress);
  const storageContract = await Storage.attach(storageAddress);
  await doTx(
    "Add EventEmitter address to storage",
    storageContract.setEventEmitterAddress(eventEmitter.address)
  );
  return {
    EventEmitter: eventEmitter.address,
  };
};
