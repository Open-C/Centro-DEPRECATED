pragma solidity >0.5.0;

//import "@openzeppelin/contracts/math/SafeMath.sol";
//import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
//import "@openzeppelin/contracts/utils/Address.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Storage.sol";
import "./Types.sol";
//import "../Connectors/MoolaC.sol";
import "../Interfaces/IERC20Token.sol";
import "../ContractCaller.sol";
import "../Interfaces/ILendingPool.sol";
import "../Interfaces/ILendingPoolAddressProvider.sol";

contract CentroWallet is ContractCaller{
    //using SafeMath for uint256;
    
    address store;
    address owner;
    mapping(address => uint256) private deposited;
    address[] private token_addr;
    mapping (address => bool) auth;

    constructor(address _owner, address _store) public {
        owner = _owner;
        auth[_owner] = true;
        store = _store;
    }

    modifier isMain() {
        require(msg.sender == Storage(store).getArbo() || msg.sender == owner, "Unauthorized access");
        _;
    }

    event ConnectorCalled(address _loc, bytes data);

    function receive() external payable {}

    function deposit(address _from, address _token, uint256 _amt) payable external isMain {
        if (_token != Storage(store).getEthAddress()) {
            IERC20Token token = IERC20Token(_token);
            require(_amt <= token.balanceOf(address(this)), "Not enough moneys.");
            token.transferFrom(_from, address(this), _amt);
        } // else, celo was sent and is auto-deposited
        if (deposited[_token] == 0) {
            token_addr.push(_token);
        }
        deposited[_token] += _amt;
    }

    function withDraw(address payable _from, address _token, uint256 _amt) external isMain {
        require(auth[_from], "Unauthorized withdraw");
        if (_token != Storage(store).getEthAddress()) {
            IERC20Token token = IERC20Token(_token);
            uint256 amt = _amt == uint(0) ? token.balanceOf(address(this)) : _amt;
            require(amt <= token.balanceOf(address(this)), "Insufficient funds");
            token.approve(_from, amt);
            token.transfer(_from, amt);
        } else {
            _from.transfer(_amt);
            // (bool success, ) = _from.call.value(_amt)("");
            // require(success, "payment failed");
        }

        deposited[_token] -= _amt;
    }

    function send(address _from, address _tok, address payable _to, uint256 _amt) payable external isMain {
        require(auth[_from], "Unauthorized transfer.");
        if (_tok != Storage(store).getEthAddress()) {
            IERC20Token token = IERC20Token(_tok);
            uint256 amt = _amt == uint(0) ? token.balanceOf(address(this)) : _amt;
            require(amt <= token.balanceOf(address(this)), "Insufficient funds");
            token.approve(_from, amt);
            token.transfer(_from, amt);
        } else {
            _to.transfer(_amt);
            // (bool success, ) = _from.call.value(_amt)("");
            // require(success, "payment failed");
        }

        deposited[_tok] -= _amt;
    }

    function incrementBasis(address _tok, uint256 _amt) external isMain {
        deposited[_tok] += _amt;
    }

    function getBasis(address _from) public isMain view returns (address[] memory, uint256[] memory) {
        require(auth[_from], "Unauthorized query.");
        uint256[] memory _bal = new uint256[](token_addr.length);
        for (uint i = 0; i < token_addr.length; i++) {
            _bal[i] = deposited[token_addr[i]];
        }
        return (token_addr, _bal);
    }

    function depositMoola(address _from, address _token, uint256 _amt) external payable isMain {
        require(auth[_from], "Unauthorized query.");
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(Storage(store).getAddressProvider("moola"));        
        ILendingPool moola = ILendingPool(lpa.getLendingPool());
        if (_token != Storage(store).getEthAddress()) {
            IERC20Token token = IERC20Token(_token);
            require(_amt <= token.balanceOf(address(this)), "Not enough moneys.");
            token.approve(address(moola), _amt);
            moola.deposit.value(0)(_token, _amt, 0);

        } else {
            moola.deposit.value(_amt)(_token, _amt, 0);
        }
    }

    function withdrawMoola(address _from, address _token, uint256 _amt) external isMain {
        require(auth[_from], "Unauthorized query.");
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(Storage(store).getAddressProvider("moola"));        
        ILendingPool moola = ILendingPool(lpa.getLendingPool());
        moola.redeemUnderlying(_token, address(this), _amt, 0);
    }

    function callConnector(address _from, address _target, bytes calldata _calldata) external payable returns (bytes memory){
        require(auth[_from], "Unauthorized connector call");
        emit ConnectorCalled(_target, _calldata);
        return delegate(_target, _calldata);
    }

    function contractCall(address _from, uint256 _amt, address payable _target, bytes calldata _calldata) external payable returns (bytes memory){
        require(auth[_from], "Unauthorized connector call");
        emit ConnectorCalled(_target, _calldata);
        return sendCelo(_target, _amt, _calldata);
    }
}