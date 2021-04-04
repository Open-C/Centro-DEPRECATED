pragma solidity >0.5.0;
import "./Types.sol"
contract Storage is Types{
    mapping(string => address) conectors;
    mapping(address => uint256[]) addrToIds;
    mapping(uint256 => Wallet) idToWallet;
    mapping(address => bool) admin;
    address centroAddr;
    bool adminSet = false;
    uint256 numWallets = 0;

    modifier isAdmin() {
        require (admin[msg.sender] || msg.sender == centroAddr, "Not an admin");
        _;
    }

    function addAdmin(address _add) external isAdmin {
        admin[_add] = true;
    }

    function getArbo() pure view returns (address) {
        return centroAddr;
    }

    function setArboAddr(address _add) external isAdmin {
        centroAddr = _add;
    }

    function getConnector(String memory _name) {
        return connectors[_name];
    }

    function retrieveIds(address _addr) view isAdmin returns (uint256[] storage) {
        require (addrToWallet[_addr].length > 0, "Address does not have any accounts");
        return addrToWallet[_addr];
    }

    function getWallet(uint256 _id) view isAdmin returns (Wallet storage) {
        require(idToWallet[_id].addr != address(0), "Wallet does not exist");
        return idToWallet[_id];
    }

    function addWallet(address _user, Wallet _wallet) external isAdmin {
        addrToIds[_user] = _wallet.id;
        idToWallet[_wallet.id] = _wallet;
        numWallets++;

    }

    function getNumWallets() view isAdmin returns (uint256) {
        return numWallets;
    }

    function init(address[] _addrs) external {
        require (!adminSet, "init has already been ran!");
        for (uint256 i = 0; i < _addrs.length; i++) {
            admin[_addrs] = true;
        }
        adminSet = true;
    }
}