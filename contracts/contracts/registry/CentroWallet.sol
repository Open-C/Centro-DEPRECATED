pragma solidity >0.5.0;

//import "@openzeppelin/contracts/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//import "@openzeppelin/contracts/utils/Address.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Storage.sol";
import "./Types.sol";
//import "../connectors/MoolaC.sol";
import "../interfaces/IERC20Token.sol";
import "../ContractCaller.sol";
import "../interfaces/ILendingPool.sol";
import "../interfaces/ILendingPoolAddressProvider.sol";

contract CentroWallet is ContractCaller {
	using SafeMath for uint256;
	
	address store;
	address owner;
	mapping(address => uint256) private deposited;
	address[] private tokenAddresses;
	enum Role {
	    owner,
	    admin,
	    contributor,
	    beneficiary
	} 
	
	// Possibly do bit-masking for authorization levels instead of an enum.  bit 0 = can withdraw, bit 1 = can deposit, bit 2 = can control, bit 3 = beneficiary
	mapping(address => bool) isAuthorized;
	mapping(address => Role) roles;

	constructor(address _owner, address _store) public {
		owner = _owner;
		isAuthorized[_owner] = true;
		store = _store;
	}

	modifier isMain() {
		require(msg.sender == Storage(store).getCentro() || msg.sender == owner, "Unauthorized access");
		_;
	}
	
	modifier isAuth(address _address) {
	    require(isAuthorized[_address], "User is not authorized to access this wallet");
	    _;
	}
	
	modifier excludeRole(address _address, Role _securityLevel) {
	    require(roles[_address] != _securityLevel, "User is not the correct role for this operation");
	    _;
	}
	
	modifier onlyRole(Role _role, address _address) {
	    require(roles[_address] == _role, "User is the incorrect role for this operation");
	    _;
	}

	event ConnectorCalled(address _loc, bytes data);
	event RoleAdded(address _user, Role _role);
	event RoleRevoked(address _user, Role _role);
	

	function receive() external payable {}
	
	function addRole(address _from, address _toAdd, Role _role) public isMain isAuth(_from) onlyRole(Role.owner, _from) {
	    isAuthorized[_toAdd] = true;
	    roles[_toAdd] = _role;
	    emit RoleAdded(_toAdd, _role);
	}
	
	function revokeRole(address _from, address _toRevoke) public isMain isAuth(_from) onlyRole(Role.owner, _from) {
	    require(_toRevoke != owner, "The original owner cannot be revoked");
	    isAuthorized[_toRevoke] = false;
	    emit RoleRevoked(_toRevoke, roles[_toRevoke]);
	}

	function deposit(address _from, address _token, uint256 _amount) payable external isMain isAuth(_from) excludeRole(_from, Role.beneficiary){
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

	function withdraw(address payable _from, address _token, uint256 _amount) external isMain isAuth(_from) onlyRole(Role.owner, _from){
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

	function send(address _from, address _token, address payable _to, uint256 _amount) payable external isMain isAuth(_from) onlyRole(Role.owner, _from){
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

	function getBasis(address _from) public isMain isAuth(_from) view returns (address[] memory, uint256[] memory) {
		require(isAuthorized[_from], "Unauthorized query.");
		uint256[] memory _bal = new uint256[](tokenAddresses.length);
		for (uint i = 0; i < tokenAddresses.length; i++) {
			_bal[i] = deposited[tokenAddresses[i]];
		}
		return (tokenAddresses, _bal);
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