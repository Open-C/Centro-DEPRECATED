// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Storage.sol";
import "./Wallet/CentroWallet.sol";
import "./EventEmitter.sol";

contract WalletFactory is Types {
	mapping(address => uint256[]) public addressToWalletIDs;
	mapping(uint256 => Wallet) public walletIDToWallet;
	mapping(address => uint256) currentWallet;
	mapping(address => bool) admin;
	address siphonAddress;
	uint256 numWallets;
	Storage store;
	
	
	constructor (address _store, address _siphonAddress) public {
		store = Storage(_store);
		numWallets = 1;
		admin[msg.sender] = true;
		siphonAddress = _siphonAddress;
	}

	modifier adminOnly() {
		require(admin[msg.sender], "User must be an admin");
		_;
	}

	function addAdmin(address toAdd) public adminOnly  {
		admin[toAdd] = true;
	}

	function newWallet(string calldata name) external {
		address owner = msg.sender;

		CentroWallet wallet = new CentroWallet(owner, address(store));
		Wallet storage _wallet = walletIDToWallet[numWallets];
		uint256[] storage walletIDs = addressToWalletIDs[owner];
		//bool isFirstWallet = walletIDs.length == 0;
		uint256 walletID = numWallets;

		_wallet.name = name;
		_wallet.addr = address(wallet);
		_wallet.owner = owner;
		walletIDs.push(walletID);
		numWallets++;
		currentWallet[msg.sender] = walletID;

		//EventEmitter(store.getEventEmitter()).emitWalletCreated(msg.sender, address(wallet), isFirstWallet);
	}

	function addWallet(address _user, address _loc, string memory name) private {
		Wallet storage _wallet = walletIDToWallet[numWallets];
		uint256[] storage walletIDs = addressToWalletIDs[_user];
		_wallet.name = name;
		_wallet.addr = _loc;
		walletIDs.push(numWallets);
		numWallets++;
	}

	function getAccountIDs(address _user) public view returns (uint256[] memory) {
		require (addressToWalletIDs[_user].length > 0, "Address does not have any accounts");
		return(addressToWalletIDs[_user]);
	}

	function getWallet(uint256 _walletID) public view returns (string memory, address) {
		Wallet storage wallet = walletIDToWallet[_walletID];
		require(wallet.addr != address(0), "Wallet does not exist");
		return (wallet.name, wallet.addr);
	}

	function getWalletAddress(uint256 _walletID) public view returns (address) {
		Wallet storage wallet = walletIDToWallet[_walletID];
		require(wallet.addr != address(0), "Wallet does not exist");
		return (wallet.addr);
	}
	
	function _getWallet(uint256 _walletID) internal view returns (CentroWallet) {
		uint256 walletID = _walletID == 0 ? currentWallet[msg.sender] : _walletID;
		require(walletID != 0, "Provide a wallet id, or persist a wallet.");
		address wallet;
		string memory name;
		(name, wallet) = getWallet(walletID);
		return (CentroWallet(wallet));
	}

	function _siphon(address _token, uint256 _earned, uint256 _walletID) internal returns (uint256 _siphoned) {
		CentroWallet wallet = _getWallet(_walletID);
		uint256 toSiphon = _earned / 10;
		wallet.approve(msg.sender, _token, siphonAddress, toSiphon);
		IERC20(_token).transferFrom(address(wallet), siphonAddress, toSiphon);
		_siphoned = toSiphon;
	}
}