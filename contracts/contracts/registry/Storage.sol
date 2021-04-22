pragma solidity >0.5.0;
import "./Types.sol";

contract Storage is Types {
	mapping(string => address payable) connectors;
	mapping(address => bool) admin;
	mapping(string => address) addressProviders;
	address centroAddress;
	bool adminSet;

	constructor() public {
		adminSet = false;
	}

	modifier isAdmin() {
		require (admin[msg.sender] || msg.sender == centroAddress, "Not an admin");
		_;
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

	function getConnector(string memory _name) public view returns (address payable) {
		return connectors[_name];
	}

	function addConnector(string calldata _name, address payable _address) external returns(bool){
		connectors[_name] = _address;
		return true;
	}

	function getEthAddress() public pure returns (address) {
		return 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
	}

	function newAddressProvider(string calldata _name, address payable _contract) isAdmin external {
		addressProviders[_name] = _contract;
	}

	function getAddressProvider(string memory _name) public view returns (address) {
		require(addressProviders[_name] != address(0), "Provider does not exist");
		return addressProviders[_name];
	}

	function init(address[] memory _addresses) public {
		require (!adminSet, "init has already been ran!");
		for (uint256 i = 0; i < _addresses.length; i++) {
			admin[_addresses[i]] = true;
		}
		adminSet = true;
	}
}