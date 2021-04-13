pragma solidity >0.5.0;

import "./registry/Storage.sol";
import "./registry/Types.sol";
import "./registry/CentroWallet.sol";

contract WalletFactory is Types {
    mapping(address => uint256[]) public addrToIds;
    mapping(uint256 => Wallet) public idToWallet;
    mapping(address => uint256) currentWallet;
    uint256 numWallets;
    Storage store;
    address lastAdded;

    function newWallet(string calldata name) external returns (bool) {
        CentroWallet wallet = new CentroWallet(msg.sender, address(store));
        address owner = msg.sender;
        Wallet storage _wallet = idToWallet[numWallets];
        uint256[] storage Ids = addrToIds[owner];
        lastAdded = owner;
        uint256 wallet_id = numWallets;

        _wallet.name = name;
        _wallet.addr = address(wallet);
        _wallet.owner = msg.sender;
        Ids.push(wallet_id);
        numWallets++;
        currentWallet[msg.sender] = wallet_id;
        return true;
    }

    function addWallet(address _user, address _loc, string memory name) private {
        Wallet storage _wallet = idToWallet[numWallets];
        uint256[] storage Ids = addrToIds[_user];
        _wallet.name = name;
        _wallet.addr = _loc;
        Ids.push(numWallets);
        numWallets++;
    }

    function getAccountIds(address _addr) public view returns (uint256[] memory) {
        require (addrToIds[_addr].length > 0, "Address does not have any accounts");
        return(addrToIds[_addr]);
    }

    function getWallet(uint256 _id) public view returns (string memory, address) {
        Wallet storage wallet = idToWallet[_id];
        require(wallet.addr != address(0), "Wallet does not exist");
        return (wallet.name, wallet.addr);
    }

    function getWalletAddress(uint256 _id) public view returns (address) {
        Wallet storage wallet = idToWallet[_id];
        require(wallet.addr != address(0), "Wallet does not exist");
        return (wallet.addr);
    }
}

contract CentroMain is WalletFactory{
    bool test;

    constructor (address _store) public WalletFactory(){
        store = Storage(_store);
        numWallets = 0;
    }

    // function getAccountIds() public view returns (uint256[] memory) {
    //     return (retrieveIds(msg.sender));
    // }

    function persistWallet(uint256 _id) public returns (string memory) {
        address w;
        string memory name;
        (name, w) = super.getWallet(_id);
        //require (w.owner == msg.sender, "User is not authorized for the given id");
        currentWallet[msg.sender] = _id;
        return name;
    } 

    function _getWallet(uint256 _wId) internal view returns (CentroWallet) {
        uint256 wId = _wId == 0 ? currentWallet[msg.sender] : _wId;
        require(wId != 0, "Provide a wallet id, or persist a wallet.");
        address w;
        string memory name;
        (name, w) = super.getWallet(wId);
        return(CentroWallet(w));
    }

    function getAccountOverview() public view returns (address[] memory, uint256[] memory) {
        uint256[] memory IDs = addrToIds[msg.sender];
        address[] memory addresses = new address[](IDs.length);
        for (uint256 i = 0; i < IDs.length; i++) {
            address w;
            string memory name;
            (name, w) = super.getWallet(IDs[i]);
            addresses[i] = w;
        }
    }

    function getWalletBalance(uint256 _wId) public view returns (address[] memory tokens, uint256[] memory balances) {
        CentroWallet sw = _getWallet(_wId);
        return sw.getBasis(msg.sender);
    }

    function getMoolaBalance(address[] memory _toks, uint256  _wId) public returns (uint256[] memory) {
        CentroWallet sw = _getWallet(_wId);
        bytes memory data = abi.encodeWithSignature("getBalance(address[])", _toks);

        bytes memory response = sw.callConnector(msg.sender, store.getConnector("moola"), data);
        uint256[] memory balances =  abi.decode(response, (uint256[]));
        return balances;
    }

    // function deposit(address _tok, uint256 _amt, uint256 _wId) external payable {
    //     CentroWallet sw = _getWallet(_wId);
    //     sw.deposit(msg.sender, _tok, _amt);
    // }

    function encodeSelector(bytes memory selector) pure private returns (bytes4) {
        return (bytes4(keccak256(selector)));
    }

    function moolaDeposit(address _tok, uint256 _amt, uint256 _wId) external payable {
        CentroWallet sw = _getWallet(_wId);
        //bytes4 selector = bytes4(keccak256("deposit(address, uint256)"));
        bytes4 selector = encodeSelector("deposit(address, uint256)");
        bytes memory data = abi.encodeWithSelector(selector, _tok, _amt);
        sw.callConnector(msg.sender, store.getConnector("moola"), data);
    }

    function withdraw(address _tok, uint256 _amt, uint256 _wId) external payable {
        CentroWallet sw = _getWallet(_wId);
        sw.withDraw(msg.sender, _tok, _amt);
    }

    function moolaWithdraw(address _tok, uint256 _amt, uint256 _wId) public payable {
        CentroWallet sw = _getWallet(_wId);
        //bytes memory data = abi.encodeWithSignature("withdraw(address, uint256)", _tok, _amt);
        //sw.callConnector(msg.sender, store.getConnector("moola"), data);
        sw.depositMoola(msg.sender, _tok, _amt);
    }

    function buyCelo(uint256 _amt, uint256 _maxSellAmt, uint256 _wId) external {
        CentroWallet sw = _getWallet(_wId);
        bytes memory data = abi.encodeWithSignature("buyCelo(uint256, uint256)", _amt, _maxSellAmt);
        sw.callConnector(msg.sender, store.getConnector("exchange"), data);
    }

    function sellCelo(uint256 _amt, uint256 _minBuyAmt, uint256 _wId) external {
        CentroWallet sw = _getWallet(_wId);
        bytes memory data = abi.encodeWithSignature("sellCelo(uint256, uint256)", _amt, _minBuyAmt);
        sw.callConnector(msg.sender, store.getConnector("exchange"), data);
    }

    function send(address _tok, uint256 _receiver, uint256 _amt, uint256 _wId) payable external {
        CentroWallet from = _getWallet(_wId);
        CentroWallet to = _getWallet(_receiver);
        from.send(msg.sender, _tok, address(to), _amt);
        to.incrementBasis(_tok, _amt);
    }

    function callConnector(string calldata _connector, bytes calldata _calldata, uint256 _wId) external {
        address target = store.getConnector(_connector);
        require(target != address(0), "Not a valid connector name");
        CentroWallet sw = _getWallet(_wId);
        sw.callConnector(msg.sender, target, _calldata);
    }
    
}