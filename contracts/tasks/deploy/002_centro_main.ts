import { DeployFunction, getDeployment } from ".";
import { ethers } from "hardhat";
import { ICeloNetwork, doTx } from "@ubeswap/hardhat-celo";

const SIPHON_ADDRESS = "0x6c0d6Fba3bcdb224278474E8d524F19c6BB55850";

export const deployCentroMain: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  const deployerAddress = await deployer?.getAddress();
  const chainId = env.network.config.chainId || ICeloNetwork["ALFAJORES"];
  const storageAddress =
    (await getDeployment("Storage", chainId))["Storage"] || "0x0";

  const CentroMain = await ethers.getContractFactory("CentroMain");
  const Storage = await ethers.getContractFactory("Storage");
  const centroMain = await CentroMain.deploy(storageAddress, SIPHON_ADDRESS);
  const storageContract = await Storage.attach(storageAddress);
  await doTx(
    "Add CentroMain address to storage",
    storageContract.setCentroContractAddress(centroMain.address)
  );
  return {
    CentroMain: centroMain.address,
  };
};
