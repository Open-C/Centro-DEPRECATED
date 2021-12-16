// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface Types {
	struct Wallet {
		string name;
		string role;
		address addr;
		address owner;
		uint256 id;
	}
}

contract Storage is Ownable {
	mapping(address => bool) admin;
	mapping(bytes32 => address) contracts;
	address centroAddress;
	address eventEmitter;
	bool adminSet;

	modifier isAdmin() {
		require(admin[msg.sender] || msg.sender == centroAddress, "Not an admin");
		_;
	}

	function _getAddress(bytes32 _id) internal view returns (address) {
		return contracts[_id];
	}

	function _addAddress(bytes32 _id, address _loc) internal {
		contracts[_id]  =_loc;
	}

	function canEmitEvents(address _contract) public returns (bool) {
		return true;
	}

	function getAdminStatus(address _user) public view returns (bool) {
		return admin[_user];
	}

	function getCentro() public view returns (address) {
		return centroAddress;
	}

	function setCentroContractAddress(address _address) external onlyOwner {
		centroAddress = _address;
	}

	function getEventEmitter() public view returns (address) {
		return centroAddress;
	}

	function setEventEmitterAddress(address _address) external onlyOwner {
		centroAddress = _address;
	}

	function getEthAddress() public pure returns (address) {
		return 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
	}

	function newAddress(string calldata _name, address payable _contract) external onlyOwner  {
		_addAddress()
	}

	function getAddress(bytes32 memory _id) public view returns (address) {
		return _getAddress(_id)
	}

	function init(address[] memory _addresses) public {
		require (!adminSet, "init has already been ran!");
		for (uint256 i = 0; i < _addresses.length; i++) {
			admin[_addresses[i]] = true;
		}
		adminSet = true;
	}
}