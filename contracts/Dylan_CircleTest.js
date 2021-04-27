const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");
const accounts = require("./accounts.json");
// 2. Import the getAccount function
const getAccount = require("./getAccount").getAccount;

const GOV_TYPE = {
  ANARCHY: 0,
  DEMOCRATIC: 1,
  DICTATOR: 2,
};

// 3. Init a new kit, connected to the alfajores testnet
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);
const SavingCircle = require("./build/contracts/SavingCircle.json");

async function initContract() {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = SavingCircle.networks[networkId];
  const gld = await kit.contracts.getGoldToken();
  const stable = await kit.contracts.getStableToken();
  let account = await getAccount();
  let circle = new web3.eth.Contract(
    SavingCircle.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log(circle.options.address);
  console.log(await circle.methods.getCircles(account.address).call());
  await createCircle(
    circle,
    "test1",
    Object.keys(accounts.addrs).map((a) => String(accounts.addrs[a])),
    gld,
    5,
    "Democratic",
    30,
    false
  );
}

async function createCircle(
  contract,
  name,
  members,
  token,
  minDeposit,
  govType,
  cycleLength,
  autoStart
) {
  console.log(members);
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(minDeposit + "");
  const txObject = await contract.methods.createCircle(
    name,
    members,
    token.address,
    amount,
    GOV_TYPE[govType],
    cycleLength,
    autoStart,
    members.length
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });
  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function withdraw(instance, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt);
  const txObject = await instance.methods.withdraw(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount,
    1
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function withdrawMoola(instance, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt);
  const txObject = await instance.methods.moolaWithdraw(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount,
    1
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
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
  const txObject = await instance.methods.depositMoola(
    account.address,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function depositMoolaCentro(instance, token, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt);
  const txObject = await instance.methods.moolaDeposit(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount,
    1
  );
  let tx = await kit.sendTransactionObject(txObject, { from: account.address });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function send(instance, from, to, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt);
  const txObject = await instance.methods.send(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    to,
    amount,
    from
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

async function deposit(instance, token, amt) {
  let account = await getAccount();
  const amount = web3.utils.toWei(amt);
  kit.connection.addAccount(account.privateKey);
  const txObject = instance.methods.deposit(
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    amount,
    1
  );
  let tx = await kit.sendTransactionObject(txObject, {
    from: account.address,
    value: amount,
  });

  let receipt = await tx.waitReceipt();
  console.log(receipt);
}

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
