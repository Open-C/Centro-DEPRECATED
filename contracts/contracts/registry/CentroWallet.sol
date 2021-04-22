pragma solidity >0.5.0;

//import "@openzeppelin/contracts/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//import "@openzeppelin/contracts/utils/Address.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Storage.sol";
import "./Types.sol";
//import "../connectors/MoolaC.sol";
import "../interfaces/IERC20Token.sol";
import "../ContractCaller.sol";
import "../interfaces/ILendingPool.sol";
import "../interfaces/ILendingPoolAddressProvider.sol";

contract CentroWallet is ContractCaller {
	//using SafeMath for uint256;
	
	address store;
	address owner;
	mapping(address => uint256) private deposited;
	address[] private tokenAddresses;
	mapping(address => bool) isAuthorized;

	constructor(address _owner, address _store) public {
		owner = _owner;
		isAuthorized[_owner] = true;
		store = _store;
	}

	modifier isMain() {
		require(msg.sender == Storage(store).getCentro() || msg.sender == owner, "Unauthorized access");
		_;
	}

	event ConnectorCalled(address _loc, bytes data);

	function receive() external payable {}

	function deposit(address _from, address _token, uint256 _amount) payable external isMain {
		if (_token != Storage(store).getEthAddress()) {
			IERC20Token token = IERC20Token(_token);
			require(_amount <= token.balanceOf(address(this)), "Not enough moneys.");
			token.transferFrom(_from, address(this), _amount);
		} // else, celo was sent and is auto-deposited
		if (deposited[_token] == 0) {
			tokenAddresses.push(_token);
		}
		deposited[_token] += _amount;
	}

	function withdraw(address payable _from, address _token, uint256 _amount) external isMain {
		require(isAuthorized[_from], "Unauthorized withdraw");
		if (_token != Storage(store).getEthAddress()) {
			IERC20Token token = IERC20Token(_token);
			uint256 amount = _amount == uint(0) ? token.balanceOf(address(this)) : _amount;
			require(amount <= token.balanceOf(address(this)), "Insufficient funds");
			token.approve(_from, amount);
			token.transfer(_from, amount);
		} else {
			_from.transfer(_amount);
			// (bool success, ) = _from.call.value(_amount)("");
			// require(success, "payment failed");
		}

		deposited[_token] -= _amount;
	}

	function send(address _from, address _token, address payable _to, uint256 _amount) payable external isMain {
		require(isAuthorized[_from], "Unauthorized transfer.");
		if (_token != Storage(store).getEthAddress()) {
			IERC20Token token = IERC20Token(_token);
			uint256 amount = _amount == uint(0) ? token.balanceOf(address(this)) : _amount;
			require(amount <= token.balanceOf(address(this)), "Insufficient funds");
			token.approve(_from, amount);
			token.transfer(_from, amount);
		} else {
			_to.transfer(_amount);
			// (bool success, ) = _from.call.value(_amount)("");
			// require(success, "payment failed");
		}

		deposited[_token] -= _amount;
	}

	function incrementBasis(address _token, uint256 _amount) external isMain {
		deposited[_token] += _amount;
	}

	function getBasis(address _from) public isMain view returns (address[] memory, uint256[] memory) {
		require(isAuthorized[_from], "Unauthorized query.");
		uint256[] memory _bal = new uint256[](tokenAddresses.length);
		for (uint i = 0; i < tokenAddresses.length; i++) {
			_bal[i] = deposited[tokenAddresses[i]];
		}
		return (tokenAddresses, _bal);
	}

	function depositMoola(address _from, address _token, uint256 _amount) external payable isMain {
		require(isAuthorized[_from], "Unauthorized query.");
		ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(Storage(store).getAddressProvider("moola"));		
		ILendingPool moola = ILendingPool(lpa.getLendingPool());
		if (_token != Storage(store).getEthAddress()) {
			IERC20Token token = IERC20Token(_token);
			require(_amount <= token.balanceOf(address(this)), "Not enough moneys.");
			token.approve(address(moola), _amount);
			moola.deposit.value(0)(_token, _amount, 0);

		} else {
			moola.deposit.value(_amount)(_token, _amount, 0);
		}
	}

	function withdrawMoola(address _from, address _token, uint256 _amount) external isMain {
		require(isAuthorized[_from], "Unauthorized query.");
		ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(Storage(store).getAddressProvider("moola"));		
		ILendingPool moola = ILendingPool(lpa.getLendingPool());
		moola.redeemUnderlying(_token, address(this), _amount, 0);
	}

	function callConnector(address _from, address _target, bytes calldata _calldata) external payable returns (bytes memory){
		require(isAuthorized[_from], "Unauthorized connector call");
		emit ConnectorCalled(_target, _calldata);
		return delegate(_target, _calldata);
	}

	function contractCall(address _from, uint256 _amount, address payable _target, bytes calldata _calldata) external payable returns (bytes memory){
		require(isAuthorized[_from], "Unauthorized connector call");
		emit ConnectorCalled(_target, _calldata);
		return sendCelo(_target, _amount, _calldata);
	}
}