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
  await testCircleCreation(circle, account);
  await testDeposit(circle, account);
}

async function testDeposit(circle, account) {
  const gld = await kit.contracts.getGoldToken();
  const circleIDs = await circle.methods.getCircles(account.address).call();
  await deposit(circle, circleIDs[0], gld, 5);
}

async function testCircleCreation(circle, account) {
  let circleIDs = await circle.methods.getCircles(account.address).call();
  if (circleIDs.length == 0) {
    await createCircle(
      circle,
      "test1",
      Object.keys(accounts.addrs).map((a) => String(accounts.addrs[a])),
      gld,
      5,
      "DEMOCRATIC",
      30,
      false
    );
    circleIDs = await circle.methods.getCircles(account.address).call();
  }
  console.log(await circle.methods.getCircleInfo(circleIDs[0]).call());
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

async function deposit(contract, circleId, token, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt + "");

  const approveTx = await token
    .approve(contract.options.address, amount)
    .send({ from: account.address });
  const approveReceipt = await approveTx.waitReceipt();
  console.log(approveReceipt);

  const txObject = await contract.methods.deposit(
    circleId,
    token.address,
    amount
  );
  const tx = await kit.sendTransaction(txObject, { from: account.address });
  const receipt = await tx.waitReceipt();
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
