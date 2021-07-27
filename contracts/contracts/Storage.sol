// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

interface Types {
	struct Wallet {
		string name;
		string role;
		address addr;
		address owner;
		uint256 id;
	}
}

contract Storage is Types {
	mapping(address => bool) admin;
	mapping(string => address) contracts;
	address centroAddress;
	address eventEmitter;
	bool adminSet;

	constructor() public {
		adminSet = false;
	}

	modifier isAdmin() {
		require(admin[msg.sender] || msg.sender == centroAddress, "Not an admin");
		_;
	}

	function canEmitEvents(address _contract) public returns (bool) {
		return true;
	}

	function getAdminStatus(address _user) public view returns (bool) {
		return admin[_user];
	}

	function addAdmin(address _address) external isAdmin {
		admin[_address] = true;
	}

	function getCentro() public view returns (address) {
		return centroAddress;
	}

	function setCentroContractAddress(address _address) external isAdmin {
		centroAddress = _address;
	}

	function getEventEmitter() public view returns (address) {
		return centroAddress;
	}

	function setEventEmitterAddress(address _address) external isAdmin {
		centroAddress = _address;
	}

	function getEthAddress() public pure returns (address) {
		return 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
	}

	function newAddress(string calldata _name, address payable _contract) external isAdmin  {
		contracts[_name] = _contract;
	}

	function getAddress(string memory _name) public view returns (address) {
		require(contracts[_name] != address(0), "Provider does not exist");
		return contracts[_name];
	}

	function init(address[] memory _addresses) public {
		require (!adminSet, "init has already been ran!");
		for (uint256 i = 0; i < _addresses.length; i++) {
			admin[_addresses[i]] = true;
		}
		adminSet = true;
	}
}