pragma solidity >0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Storage.sol";
import "./Types.sol";
import "../Connectors/MoolaC.sol";
import "../Interfaces/IERC20Token.sol";
import "../ContractCaller.sol";

contract ArboWallet is ReentrancyGuard, ContractCaller{
    using SafeMath for uint256;
    address owner;
    mapping(address => uint256) private deposited;
    address[] private token_addr;
    mapping (address => bool) auth;
    address store = 0x00000;

    constructor(address _owner) {
        this.owner = _owner;
        auth[_owner] = true;
    }

    modifier isMain() {
        require(msg.sender == Storage(store).getArbo(), "Unauthorized access");
        _;
    }

    function receive() external payable {}

    function deposit(address _from, address _token, uint256 _amt) payable external isMain {
        require(auth[_from], "Unauthorized deposit.");
        IERC20Token token = IERC20Token(_token);
        token.transferFrom(_from, address(this), _amt);
        if (token_addr[_token] == 0) {
            token_addr.push(_token);
        }
        deposited[_token] += _amt;
    }

    function withDraw(address _from, address _token, uint256 _amt) external isMain {
        require(auth[_from], "Unauthorized withdraw");
        IERC20Token token = IERC20Token(_token);
        uint256 amt = _amt == -1 ? token.balanceOf(address(this)) : _amt;
        require(amt <= token.balanceOf(address(this)), "Insufficient funds");
        token.approve(_from, amt);
        token.transfer(_from, amt);
        deposited[_token] -= amt;
    }

    function send(address _from, address _tok, address _to, uint256 _amt) payable external isMain {
        require(auth[_from], "Unauthorized transfer.");
        IERC20Token token = IERC20Token(_tok);
        token.approve(_to, _amt);
        token.transferFrom(address(this), _to, _amt);
        deposited[_token] -= _amt;
    }

    function incrementBasis(address _tok, uint256 _amt) external isMain {
        deposited[_token] += _amt;
    }

    function getBasis(address _from) isMain returns (address[] memory _tokens, uint256[] memory _bal) {
        require(auth[_from], "Unauthorized query.");
        address[] memory _tokens = token_addr;
        uint256[_tokens.length] memory _bal;
        for (uint i = 0; i < _tokens.length; i++) {
            _bal[i] = deposited[_tokens[i]];
        }
    }

    function callConnector(address _from, address _target, bytes _calldata) external payable returns (bytes memory){
        require(auth[_from], "Unauthorized connector call");
        return delegate(_target, _calldata);
    }
}