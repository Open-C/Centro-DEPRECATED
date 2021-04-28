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
  let account = await getAccount();
  let circle = new web3.eth.Contract(
    SavingCircle.abi,
    deployedNetwork && deployedNetwork.address
  );
  console.log(circle.options.address);
  await testCircleCreation(circle, account);
  await testDeposit(circle, account);
  //await testWithdraw(circle, account);
  //await testRequest(circle, account);
  await testGetBalances(circle, account);
  await testQueryMissedPayments(circle, account);
}

async function testQueryMissedPayments(circle, account) {
  const circleIDs = await circle.methods.getCircles(account.address).call();
  console.log(await queryMissedPayments(circle, circleIDs[0]));
}

async function testGetBalances(circle, account) {
  const circleIDs = await circle.methods.getCircles(account.address).call();
  console.log(await getBalances(circle, circleIDs[0]));
}

async function testRequest(circle, account) {
  const circleIDs = await circle.methods.getCircles(account.address).call();
  await request(circle, circleIDs[0], 100);
  console.log(await getRequests(circle, circleIDs[0]));
}

async function testWithdraw(circle, account) {
  const circleIDs = await circle.methods.getCircles(account.address).call();
  await withdraw(circle, circleIDs[0], 2);
}

async function testDeposit(circle, account) {
  const gld = await kit.contracts.getStableToken();
  const circleIDs = await circle.methods.getCircles(account.address).call();
  await deposit(circle, circleIDs[0], gld, 1);
}

async function testCircleCreation(circle, account) {
  let circleIDs = await circle.methods.getCircles(account.address).call();
  const gld = await kit.contracts.getStableToken();
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
  console.log(contract._address);
  console.log(contract.options.address);
  const approveTx = await token
    .approve(contract._address, amount)
    .send({ from: account.address });
  const approveReceipt = await approveTx.waitReceipt();
  console.log(approveReceipt);

  // const txObject = await contract.methods.deposit(
  //   circleId,
  //   token.address,
  //   amount
  // );
  // const tx = await kit.sendTransaction(txObject, {
  //   from: account.address,
  //   value: 0,
  // });
  // const receipt = await tx.waitReceipt();
  // console.log(receipt);
  console.log(
    await contract.methods
      .deposit(circleId, token.address, amount)
      .send({ from: account.address })
  );
  console.log(
    await contract.methods
      .moveToMoola(circleId, token.address, amount)
      .send({ from: account.address })
  );
}

async function getRequests(contract, circleID) {
  return await contract.methods.getRequests(circleID).call();
}

async function withdraw(contract, circleId, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt + "");

  const txObject = await contract.methods.withdraw(circleId, amount);
  const tx = await kit.sendTransaction(txObject, { from: account.address });
  const receipt = await tx.waitReceipt();
  console.log(receipt);
}

async function request(contract, circleId, amt) {
  let account = await getAccount();
  kit.connection.addAccount(account.privateKey);
  const amount = web3.utils.toWei(amt + "");

  const tx = await contract.methods
    .request(circleId, amount)
    .send({ from: account.address });
  //const tx = await kit.sendTransaction(txObject, { from: account.address });
  //const receipt = await tx.waitReceipt();
  console.log(tx);
}

async function getBalances(contract, circleID) {
  return await contract.methods.getBalances(circleID).call();
}

async function queryMissedPayments(contract, circleID) {
  return await contract.methods.queryMissedPayments(circleID).call();
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
