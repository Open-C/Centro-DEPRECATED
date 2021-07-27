import { DeployFunction } from ".";
import { ethers } from "hardhat";
import protocolAddresses from "./build_config.json";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { ICeloNetwork, doTx } from "@ubeswap/hardhat-celo";
import { ContractKit } from "@celo/contractkit";
import { Signer } from "@ethersproject/abstract-signer";
import { Contract } from "@ethersproject/contracts";
import StorageABI from "../../build/abi/Storage.json";

export const deployStorage: DeployFunction = async (env) => {
  const [deployer] = env.celo.getSigners();
  //const kit = env.celo.kit;

  const deployerAddress = await deployer?.getAddress();
  const chainId = await env.celo.kit.connection.chainId();
  const network = chainId === ICeloNetwork.MAINNET ? "MainNet" : "Alfajores";
  const protocols: Record<string, string> =
    protocolAddresses["contracts"][network];

  console.log(`Deploying from address ${deployerAddress}`);

  const Storage = await ethers.getContractFactory("Storage");
  const storageContract = await Storage.deploy();

  await doTx(
    "Add initial authorized users",
    storageContract.init([deployerAddress])
  );
  console.log(await storageContract.getAdminStatus(deployerAddress));

  for (let name in protocols) {
    console.log(name, protocols[name]);
    await doTx(
      `Linking protocol ${name} to address ${protocols[name]}`,
      storageContract.newAddress(name, protocols[name])
    );
    const storedAddress = await storageContract.getAddress(name);
    console.log(`Protocol ${name} linked to address ${storedAddress}\n`);
  }
  //   Object.keys(protocols).forEach(async (name) => {
  //     await doTx(
  //       `Linking protocol ${name} to address ${protocols[name]}`,
  //       storageContract.newAddress(name, protocols[name])
  //     );
  //     console.log(await storageContract.getAddress(name));
  //   });
  //Object.keys(protocols).forEach(async (name) => {});

  //console.log(await storageContract.getEthAddress());

  return {
    Storage: storageContract.address,
  };
};

const initStorage = async (
  kit: ContractKit,
  account: Signer | undefined,
  storage: Contract
) => {
  kit.connection.addAccount(`0x${process.env.PRIVATE_KEY_DEV}`);
  const [other] = await kit.connection.getAccounts();
  const txObject = await storage.init([await account?.getAddress(), other]);
  let tx = await kit.sendTransactionObject(txObject, { from: other });
  let receipt = await tx.waitReceipt();
  console.log(receipt);
  //let instance = new kit.web3.eth.Contract(StorageABI, storage.address);
};
