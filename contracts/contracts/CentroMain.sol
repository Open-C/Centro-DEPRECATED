// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

import "./Controllers/MentoConnector.sol";
import "./Controllers/MoolaConnector.sol";
import "./Controllers/UbeConnector.sol";

contract CentroMain is UbeCombined {

	event DepositMade(address _wallet, address _token, uint256 _amount);
	event WithdrawMade(address _wallet, address _token, uint256 _amount);
	event TransferMade(address _sender, address _receiver, address _token, uint256 _amount);

	constructor(address _store, address _siphonAddress) UbeCombined(_store, _siphonAddress) {}

	function persistWallet(uint256 _walletID) public returns (string memory) {
		address wallet;
		string memory name;
		(name, wallet) = super.getWallet(_walletID);
		currentWallet[msg.sender] = _walletID;
		return name;
	} 

	function getAccountOverview() public view returns (address[] memory, uint256[] memory) {
		uint256[] memory walletIDs = addressToWalletIDs[msg.sender];
		address[] memory addresses = new address[](walletIDs.length);
		for (uint256 i = 0; i < walletIDs.length; i++) {
			address wallet;
			string memory name;
			(name, wallet) = super.getWallet(walletIDs[i]);
			addresses[i] = wallet;
		}
	}

	function getWalletBasis(uint256 _walletID) public view returns (address[] memory tokens, uint256[] memory balances) {
		CentroWallet wallet = _getWallet(_walletID);
		return wallet.getBasis(msg.sender);
	}

	function deposit(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		emit DepositMade(address(wallet), _token, _amount);
		wallet.deposit(msg.sender, _token, _amount);
	}

	function encodeSelector(bytes memory selector) private pure returns (bytes4) {
		return (bytes4(keccak256(selector)));
	}

	function withdraw(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		emit WithdrawMade(address(wallet), _token, _amount);
		wallet.withdraw(msg.sender, _token, _amount);
	}

	function send(address _token, uint256 _receiver, uint256 _amount, uint256 _walletID) payable external {
		CentroWallet from = _getWallet(_walletID);
		CentroWallet to = _getWallet(_receiver);
		from.send(msg.sender, _token, address(to), _amount);
		to.incrementBasis(_token, _amount);

		emit TransferMade(address(from), address(to), _token, _amount);
	}

	// function callContract(string calldata _connector, bytes calldata _calldata, uint256 _walletID) external {
	// 	address target = store.getAddress(_connector);
	// 	require(target != address(0), "Not a valid connector name");
	// 	CentroWallet wallet = _getWallet(_walletID);
	// 	wallet.callContract(msg.sender, target, _calldata);
	// }
}