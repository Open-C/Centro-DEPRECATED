// SPDX-License-Identifier: ISC

pragma solidity >0.8.0;

//import "@openzeppelin/contracts/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/math/SafeMath.sol";
import "../Storage.sol";
import "./ContractCaller.sol";

contract CentroWallet is ContractCaller {
	//using SafeMath for uint256;
	
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

	event ContractCalled(address target, bytes data, address caller);
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
			IERC20 token = IERC20(_token);
			//require(_amount <= token.balanceOf(address(this)), "Not enough moneys.");
			token.transferFrom(_from, address(this), _amount);
		} // else, celo was sent and is auto-deposited
		if (deposited[_token] == 0) {
			tokenAddresses.push(_token);
		}
		deposited[_token] += _amount;
	}

	function withdraw(address _from, address _token, uint256 _amount) external isMain isAuth(_from) onlyRole(Role.owner, _from){
		require(isAuthorized[_from], "Unauthorized withdraw");
		IERC20 token = IERC20(_token);

		if (_token != Storage(store).getEthAddress()) {
			uint256 amount = _amount == uint(0) ? token.balanceOf(address(this)) : _amount;
			require(amount <= token.balanceOf(address(this)), "Insufficient funds");
			require(token.approve(_from, amount), "Token approval failed!");
			token.transfer(_from, amount);
		} else {
			token.transfer(_from, _amount);
			
		}

		deposited[_token] -= _amount;
	}

	function send(address _from, address _token, address _to, uint256 _amount) payable external isMain isAuth(_from) onlyRole(Role.owner, _from){
		require(isAuthorized[_from], "Unauthorized transfer.");
		IERC20 token = IERC20(_token);

		if (_token != Storage(store).getEthAddress()) {
			uint256 amount = _amount == uint(0) ? token.balanceOf(address(this)) : _amount;
			require(amount <= token.balanceOf(address(this)), "Insufficient funds");
			require(token.approve(_to, amount), "Token approval failed");
			token.transfer(_to, amount);
		} else {
			token.transfer(_to, _amount);
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

	function callContract(address _from, address _target, bytes memory _data)
		public
		isMain
		isAuth(_from)
		onlyRole(Role.owner, _from)
		returns (bytes memory) {
		emit ContractCalled(_target, _data, _from);
		return _callContract(_target, _data);
	}

	function approve(address _from, address _token, address _target, uint256 _amt) public isMain isAuth(_from) onlyRole(Role.owner, _from) {
		_approveToken(_token, _target, _amt); 
	}

}