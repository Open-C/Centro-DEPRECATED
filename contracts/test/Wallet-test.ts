import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
//import BigNumber from "bignumber.js";

describe("Wallet Contract", () => {
  let storageContract: Contract;
  let testToken: Contract;
  let owner: SignerWithAddress | undefined;
  let centroWallet: Contract;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const Storage = await ethers.getContractFactory("Storage");
    storageContract = await Storage.deploy();
    await storageContract.init([owner?.address]);

    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy("Centro Coin", "CENT", "1000000");

    const Wallet = await ethers.getContractFactory("CentroWallet");
    centroWallet = await Wallet.deploy(owner?.address, storageContract.address);
  });

  it("Can be deployed", async () => {
    expect(!!centroWallet).true;
  });

  it("Can be deposited into", async () => {
    const toTransfer = 1000;
    await testToken.approve(centroWallet.address, toTransfer);
    await centroWallet.deposit(owner?.address, testToken.address, toTransfer);
    const newBalance: BigNumber = BigNumber.from(
      (await testToken.balanceOf(centroWallet.address))._hex
    );
    expect(newBalance.toNumber()).equals(toTransfer);
  });

  it("Can be withdrawn from", async () => {
    const toTransfer = 10000;
    const toTransferBack = 100;
    const originalBalance: BigNumber = BigNumber.from(
      (await testToken.balanceOf(owner?.address))._hex
    );
    const expectedBalance: BigNumber = originalBalance.sub(
      toTransfer - toTransferBack
    );
    await testToken.approve(centroWallet.address, toTransfer);
    await centroWallet.deposit(owner?.address, testToken.address, toTransfer);
    await centroWallet.withdraw(
      owner?.address,
      testToken.address,
      toTransferBack
    );

    const newBalance: BigNumber = BigNumber.from(
      (await testToken.balanceOf(owner?.address))._hex
    );

    expect(expectedBalance.toNumber()).equals(newBalance.toNumber());
  });

  it("Can send money between wallets", async () => {
    const toTransfer = 10000;
    const toTransferBack = 100;
    const originalBalance: BigNumber = BigNumber.from(
      (await testToken.balanceOf(owner?.address))._hex
    );
    const expectedBalance: BigNumber = originalBalance.sub(
      toTransfer - toTransferBack
    );
    await testToken.approve(centroWallet.address, toTransfer);
    await centroWallet.deposit(owner?.address, testToken.address, toTransfer);
    await centroWallet.send(
      owner?.address,
      testToken.address,
      owner?.address,
      toTransferBack
    );

    const newBalance: BigNumber = BigNumber.from(
      (await testToken.balanceOf(owner?.address))._hex
    );

    expect(expectedBalance.toNumber()).equals(newBalance.toNumber());
  });
});
