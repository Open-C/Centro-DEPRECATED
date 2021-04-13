const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");

// 2. Import the getAccount function
const getAccount = require("./getAccount").getAccount;

// 3. Init a new kit, connected to the alfajores testnet
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);
const Storage = require("./build/contracts/CentroMain.json");
const Wallet = require("./build/contracts/CentroWallet.json");

async function initContract() {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Storage.networks[networkId];
  const gld = await kit.contracts.getGoldToken();
  const stable = await kit.contracts.getStableToken();
  let account = await getAccount();
  let instance = new web3.eth.Contract(
    Storage.abi,
    deployedNetwork && deployedNetwork.address
  );
  //await addWallet(instance, "Test1");
  //await addWallet(instance, "Test2");
  console.log(await instance.methods.getAccountIds(account.address).call());
  const walletAddr = await instance.methods.getWalletAddress(1).call();
  console.log(walletAddr);
  let wallet = new web3.eth.Contract(Wallet.abi, walletAddr);
  //await deposit(wallet, walletAddr, gld, "3");
  await depositMoola(wallet, gld, "1");
}

async function addWallet(instance, name) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const txObject = await instance.methods.newWallet(name);
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function depositMoola(instance, token, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt);
  // console.log(
  //   "Approve",
  //   (
  //     await (
  //       await token
  //         .approve(instance.options.address, amt)
  //         .send({ from: account.address, gas: 2000000 })
  //     ).receiptFuture.promise
  //   ).transactionHash
  // );
  // await retry(() =>
  //   instance.methods
  //     .moolaDeposit(token.address, amt, 1)
  //     .estimateGas({ from: account.address, gas: 2000000 })
  // );
  const txObject = await instance.methods.depositMoola(
    account.address,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function persistWallet(instance, id) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const txObject = instance.methods.persistWallet(id);
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function deposit(instance, wallet, token, amt) {
  let account = await getAccount();
  const amount = web3.utils.toWei(amt);
  kit.connection.addAccount(account.privateKey);
  console.log(instance.address);
  let tx = await token.transfer(wallet, amount).send({ from: account.address });
  let receipt = await tx.waitReceipt();
  console.log("Transaction receipt: %o", receipt);
  //   const reserve = token.address;
  //   const user = account.address;
  //   const amount = web3.utils.toWei(amt);
  //   try {
  //     await retry(() =>
  //       instance.methods
  //         .deposit(reserve, amount)
  //         .estimateGas({ from: user, gas: 2000000, value: amount })
  //     );
  //   } catch (err) {
  //     console.log("Cannot deposit", err.message);
  //     return;
  //   }
  //   console.log(
  //     "Deposit",
  //     (
  //       await instance.methods
  //         .deposit(reserve, amount)
  //         .send({ from: user, gas: 2000000, value: amount })
  //     ).transactionHash
  //   );
}
//   let account = await getAccount();
//   kit.connection.addAccount(account.privateKey);
//   //   token.increaseAllowance(instance.address, amt);
//   //   token.approve(instance.address, amt);
//   //   token.approve(account.address, amt);
//   //   token.increaseAllowance(account.address, amt);
//   try {
//     await retry(() =>
//       instance.methods
//         .deposit(token.address, amt)
//         .estimateGas({ from: account.address, value: amt })
//     );
//   } catch (err) {
//     console.log("Cannot deposit", err.message);
//     console.log(err);
//     return;
//   }
//   console.log(
//     "Deposit",
//     (
//       await instance.methods
//         .deposit(token.address, amt)
//         .send({ from: account.address, value: amt })
//     ).transactionHash
//   );
//}

const retry = async (fun, tries = 5) => {
  try {
    return await fun();
  } catch (err) {
    if (tries == 0) throw err;
    //await Promise.delay(1000);
    return retry(fun, tries - 1);
  }
};

initContract();
