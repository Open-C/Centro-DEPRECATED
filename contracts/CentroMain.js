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
	//await addWallet(instance, "Test3");

	console.log(await instance.methods.getAccountIds(account.address).call());
	const walletAddr = await instance.methods.getWalletAddress(1).call();
	console.log(walletAddr);
	console.log(await instance.methods.getWalletAddress(2).call());
	let wallet = new web3.eth.Contract(Wallet.abi, walletAddr);
	//await deposit(instance, gld, "1");
	//await depositMoola(wallet, gld, "1");
	//await depositMoolaCentro(instance, gld, "5");
	//console.log(await gld.balanceOf(account.address));
	//await withdraw(instance, "2");
	//console.log(await gld.balanceOf(account.address));
	//await getMoolaBalance(instance);
	// console.log(
	//   await instance.methods
	//     .getMoolaBalance("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 1)
	//     .call()
	// );
	//withdrawMoola(instance, "2");
	await send(instance, 1, 2, "2");
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
