pragma solidity >0.5.0;
import "./Types.sol";

contract Storage is Types{
    mapping(string => address) connectors;
    mapping(address => bool) admin;
    mapping(string => address) addressProviders;
    address centroAddr;
    bool adminSet;

    constructor() public {
        adminSet = false;
    }

    modifier isAdmin() {
        require (admin[msg.sender] || msg.sender == centroAddr, "Not an admin");
        _;
    }

    function addAdmin(address _add) external isAdmin {
        admin[_add] = true;
    }

    function getArbo() public view returns (address) {
        return centroAddr;
    }

    function setArboAddr(address _add) external isAdmin {
        centroAddr = _add;
    }

    function getConnector(string memory _name) public view returns (address) {
        return connectors[_name];
    }

    function addConnector(string calldata _name, address _add) external returns(bool){
        connectors[_name] = _add;
        return true;
    }

    function getEthAddress() public pure returns (address) {
        return 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    }

    function newAddressProvider(string calldata _name, address _contract) isAdmin external {
        addressProviders[_name] = _contract;
    }

    function getAddressProvider(string memory _name) public view returns (address) {
        require(addressProviders[_name] != address(0), "Provider does not exist");
        return addressProviders[_name];
    }

    function init(address[] memory _addrs) public {
        require (!adminSet, "init has already been ran!");
        for (uint256 i = 0; i < _addrs.length; i++) {
            admin[_addrs[i]] = true;
        }
        adminSet = true;
    }
}