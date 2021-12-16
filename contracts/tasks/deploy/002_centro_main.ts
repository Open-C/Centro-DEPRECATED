import { DeployFunction, getDeployment } from ".";
import { ethers } from "hardhat";
import { ICeloNetwork, doTx } from "@ubeswap/hardhat-celo";

const SIPHON_ADDRESS = "0x6c0d6Fba3bcdb224278474E8d524F19c6BB55850";

export const deployCentroMain: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  const deployerAddress = await deployer?.getAddress();
  console.log(`Deploying from address ${deployerAddress}`);
  const chainId = env.network.config.chainId || ICeloNetwork["ALFAJORES"];
  const storageAddress =
    (await getDeployment("Storage", chainId))["Storage"] || "0x0";

  const CentroMain = await ethers.getContractFactory("CentroMain");
  const Storage = await ethers.getContractFactory("Storage");
  // const CentroWallet = await ethers.getContractFactory("CentroWallet");
  const centroMain = await CentroMain.deploy(storageAddress, SIPHON_ADDRESS);
  console.log(`Deployed at ${centroMain.address}`);
  // const wallet = await CentroWallet.deploy(deployerAddress, storageAddress);
  // console.log(`Wallet deployed at ${wallet.address}`);
  const storageContract = Storage.attach(storageAddress);
  console.log("Adding CentroMain address to Storage");

  await doTx(
    "Add CentroMain address to storage",
    storageContract.setCentroContractAddress(centroMain.address)
  );
  await doTx("Create a test Centro Wallet", centroMain.newWallet());
  console.log(`Created new Centro wallet for ${deployerAddress}`);
  return {
    CentroMain: centroMain.address,
  };
};