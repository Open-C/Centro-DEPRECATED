pragma solidity >0.5.0;

import "./registry/Storage.sol";
import "./registry/Types.sol";
import "./registry/CentroWallet.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/ILendingPoolAddressProvider.sol";

contract WalletFactory is Types {
	mapping(address => uint256[]) public addressToWalletIDs;
	mapping(uint256 => Wallet) public walletIDToWallet;
	mapping(address => uint256) currentWallet;
	uint256 numWallets;
	Storage store;
	address lastAdded;
	
	constructor (address _store) public {
		store = Storage(_store);
		numWallets = 0;
	}

	function newWallet(string calldata name) external returns (bool) {
		CentroWallet wallet = new CentroWallet(msg.sender, address(store));
		address owner = msg.sender;
		Wallet storage _wallet = walletIDToWallet[numWallets];
		uint256[] storage walletIDs = addressToWalletIDs[owner];
		lastAdded = owner;
		uint256 walletID = numWallets;

		_wallet.name = name;
		_wallet.addr = address(wallet);
		_wallet.owner = msg.sender;
		walletIDs.push(walletID);
		numWallets++;
		currentWallet[msg.sender] = walletID;
		return true;
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
		(name, wallet) = super.getWallet(walletID);
		return (CentroWallet(wallet));
	}
}

contract MoolaIntegration is WalletFactory {
    
    function _getLendingPool() internal view returns (ILendingPool) {
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(store.getAddressProvider("moola"));
        return ILendingPool(lpa.getLendingPool());
    }
    
    function _getPoolCore() internal view returns (address payable) {
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(store.getAddressProvider("moola"));
        return lpa.getLendingPoolCore();
    }
    
    function getMoolaBalance(address _token, uint256 _walletID) public view
		returns (uint256 currentATokenBalance) {
		CentroWallet wallet = _getWallet(_walletID);
		ILendingPool moola = _getLendingPool();
		(currentATokenBalance, , , , , , , , , ) = moola.getUserReserveData(_token, address(wallet));
	}
	
	function moolaDeposit(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		ILendingPool moola = _getLendingPool();
		bytes memory data = abi.encodeWithSignature("deposit(address,uint256,uint16)", _token, _amount, 0);
		uint256 value = 0;
		if (_token == store.getEthAddress()) {
		    value = _amount;
		} else {
		    wallet.approve(_token, _getPoolCore, _amount);
		}
		wallet.callContract(msg.sender, address(moola), value, data);
	}
	
	function moolaWithdraw(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		bytes memory data = abi.encodeWithSignature("redeem(uint256)", _amount);
		wallet.callContract(msg.sender, _token, data);
	}

}

contract ExchangeIntegration is WalletFactory {
    function buyCelo(uint256 _amount, uint256 _maxSellAmount, uint256 _walletID) external {
		CentroWallet wallet = _getWallet(_walletID);
		address exchAddr = store.getConnector("exchange");
		bytes memory data = abi.encodeWithSignature("buyCelo(uint256,uint256)", _amount, _maxSellAmount);
		wallet.approve(exchAddr, _maxSellAmount);
		wallet.callContract(msg.sender, 0, store.getConnector("exchange"), data);
	}

	function sellCelo(uint256 _amount, uint256 _minBuyAmount, uint256 _walletID) external {
		CentroWallet wallet = _getWallet(_walletID);
		bytes memory data = abi.encodeWithSignature("sellCelo(uint256,uint256)", _amount, _minBuyAmount);
		wallet.callConnector(msg.sender, _amount, store.getConnector("exchange"), data);
	}
}

contract CentroMain is MoolaIntegration, ExchangeIntegration {

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

	function getWalletBalance(uint256 _walletID) public view returns (address[] memory tokens, uint256[] memory balances) {
		CentroWallet wallet = _getWallet(_walletID);
		return wallet.getBasis(msg.sender);
	}

	function deposit(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		wallet.deposit.value(msg.value)(msg.sender, _token, _amount);
	}

	function encodeSelector(bytes memory selector) pure private returns (bytes4) {
		return (bytes4(keccak256(selector)));
	}

	function withdraw(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		wallet.withdraw(msg.sender, _token, _amount);
	}

	function send(address _token, uint256 _receiver, uint256 _amount, uint256 _walletID) payable external {
		CentroWallet from = _getWallet(_walletID);
		CentroWallet to = _getWallet(_receiver);
		from.send(msg.sender, _token, address(uint160(address(to))), _amount);
		to.incrementBasis(_token, _amount);
	}

	function callConnector(string calldata _connector, bytes calldata _calldata, uint256 _walletID) external {
		address target = store.getConnector(_connector);
		require(target != address(0), "Not a valid connector name");
		CentroWallet wallet = _getWallet(_walletID);
		wallet.callConnector(msg.sender, target, _calldata);
	}
}