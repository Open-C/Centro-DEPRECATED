import { ethers } from "hardhat";
import { Contract } from "ethers";
import { CentroMain as CentroMainAddress } from "../../deployments/main.alfajores.addresses.json";
import { TestFunction, getDeployment, UnitTest } from ".";
import { doTx, ICeloNetwork, networkNames } from "@ubeswap/hardhat-celo";
import { v4 as uuidv4 } from "uuid";
import tokensJSON from "./token_addresses.json";

const SIPHON_ADDRESS = "0x6c0d6Fba3bcdb224278474E8d524F19c6BB55850";

export const TestMoolaConnector: TestFunction = async (env) => {
  const [owner] = await env.celo.getSigners();
  console.log(`Interacting with contracts from address ${owner?.getAddress()}`);
  const chainId: ICeloNetwork =
    env.network.config.chainId || ICeloNetwork["ALFAJORES"];
  const network = networkNames[chainId];
  const tokens: Record<string, string> = JSON.parse(JSON.stringify(tokensJSON))[
    network
  ];

  const centroMainAddress = await getDeployment("main", chainId);
  console.log(centroMainAddress);
  const CentroMain = await ethers.getContractFactory("CentroMain");
  const centroMain = CentroMain.attach(centroMainAddress.CentroMain || "0x000");
  const cUSD = (await ethers.getContractFactory("TestToken")).attach(
    tokens["cUSD"] || "0x000"
  );
  return {
    ...(await createWallet(centroMain, uuidv4())),
    //...(await deposit(centroMain, cUSD, "10")),
    //...(await depositIntoMoola(centroMain, cUSD.address, "10")),
  };
};

const createWallet = async (
  centroMain: Contract,
  name: string
): Promise<Record<string, string>> => {
  try {
    //await doTx(`Creating a wallet named ${name}`, centroMain.newWallet("Bob"));
    const [walletName, walletAddress] = await centroMain.getWallet("1");
    console.log(`Wallet created at address ${walletAddress}`);
    return {
      createWallet: "Passed",
    };
  } catch (e) {
    console.log(e);
    return {
      createWallet: "Failed",
    };
  }
};

const deposit = async (
  centroMain: Contract,
  tokenContract: Contract,
  amount: string
): Promise<Record<string, string>> => {
  try {
    const [walletName, walletAddress] = await centroMain.getWallet("0");

    await doTx(
      `Approve transfer of token ${tokenContract.address}, at ${amount}`,
      tokenContract.approve(walletAddress, amount)
    );
    await doTx(
      `Deposit ${amount} of token ${tokenContract.address} into wallet ${walletName} at ${walletAddress}`,
      centroMain.deposit(tokenContract.address, amount, 0)
    );
    return {
      deposit: "Passed",
    };
  } catch (e) {
    console.log(e);
    return {
      deposit: "Failed",
    };
  }
};

const depositIntoMoola = async (
  centroMain: Contract,
  tokenAddr: string,
  amount: string
): Promise<Record<string, string>> => {
  try {
    await doTx(
      `Depositing ${amount} of token ${tokenAddr} into Moola`,
      centroMain.moolaDeposit(tokenAddr, amount, 0)
    );
    return {
      depositMoola: "Passed",
    };
  } catch (e) {
    console.log(e);
    return {
      depositMoola: "Failed",
    };
  }
};
