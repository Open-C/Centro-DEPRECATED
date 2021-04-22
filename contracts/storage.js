const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");

// 2. Import the getAccount function
const getAccount = require("./getAccount").getAccount;

// 3. Init a new kit, connected to the alfajores testnet
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);
const Storage = require("./build/contracts/Storage.json");

async function initContract() {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = Storage.networks[networkId];
  let account = await getAccount();

  //console.log(account.address);
  let instance = new web3.eth.Contract(
    Storage.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log(instance.options.address);
  //console.log(await instance.methods.getCentro().call());
  //console.log(await instance.methods.getConnector("moola").call());
  // let walletAdded = await instance.methods
  //   .addWallet(
  //     "0x7CF99CAE57141b05051B9dddFB7B3Dcf2Cd0ce15",
  //     "0x7CF99CAE57141b05051B9dddFB7B3Dcf2Cd0ce15",
  //     "Bob"
  //   )
  //   .call();
  // console.log(walletAdded);
  // await sleep(10000);
  // await addWallet(instance);
  // console.log(await instance.methods.getWallet(0).call());

  // console.log(
  //   await instance.methods
  //     .retrieveIds("0x7CF99CAE57141b05051B9dddFB7B3Dcf2Cd0ce15")
  //     .call()
  // );
  //   await instance.methods
  //     .addConnector("exchange", "0x11742DC489F073301c744FE388D45e92Ef6B7AED")
  //     .call();
  //   await instance.methods
  //     .addConnector("moola", "0x9bC02BC24CFa3b555Eb6b7e3Aa46128e8c6e06bc")
  //     .call();
}

async function addWallet(instance) {
  let account = await getAccount();

  // Add your account to ContractKit to sign transactions
  // This account must have a CELO balance to pay tx fees, get some https://celo.org/build/faucet
  kit.connection.addAccount(account.privateKey);
  const txObject = await instance.methods.addWallet(
    "0x7CF99CAE57141b05051B9dddFB7B3Dcf2Cd0ce15",
    "0x7CF99CAE57141b05051B9dddFB7B3Dcf2Cd0ce15",
    "Bob"
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

initContract();
