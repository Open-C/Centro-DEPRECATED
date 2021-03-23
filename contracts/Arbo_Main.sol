pragma solidity >0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./registry/Storage.sol";
import "./registry/Types.sol";
import "./Connectors/MoolaC.sol";

contract ArboMain is ReentrancyGuard, Types{
    mapping(address => uint256) currentWallet;
    Storage store = Storage(0x0000000);

    function getAccountIds() view returns (uint256[] memory) {
        return (store.retrieveIds(msg.sender));
    }

    function persistWallet(uint256 _id) {
        Wallet _w = store.getWallet(_id);
        require (_w.owner == msg.sender, "User is not authorized for the given id");
        currentWallet[msg.sender] = _id;
    } 

    function getWallet(uint256 _wId) internal view returns (SmartWallet) {
        uint256 wId = _wId == 0 ? currentWallet[msg.sender].id : _wId;
        require(wId != 0, "Provide a wallet id, or persist a wallet.");
        Wallet storage w = store.getWallet(wId);
        return(SmartWallet(w.addr));

    }

    function getAccountOverview() view returns (Wallet[] memory _wallets) {
        uint256[] memory IDs = store.retrieveIds(msg.sender);
        Wallet[] memory _wallets = new Wallet[](IDs.length);
        for (uint256 i = 0; i < IDs.length; i++) {
            _wallets[i] = store.getWallet(IDs[i]);
        }
    }

    function deposit(address _tok, uint256 _amt, uint256 _wId) external payable {
        SmartWallet sw = getWallet(_wId);
        sw.deposit(msg.sender, _tok, _amt);
    }

    function withdraw(address _tok, uint256 _amt, uint256 _wId) external payable {
        SmartWallet sw = getWallet(_wId);
        sw.withdraw(msg.sender, _tok, _amt);
    }

    function callConnector(String memory _connector, bytes _calldata, uint256 _wId) external {
        address target = store.getConnector(_connector);
        require(target != address(0), "Not a valid connector name");
        SmartWallet sw = getWallet(_wId);
        sw.callConnector(target, _calldata);
    }
    
}