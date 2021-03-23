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

    constructor(address _owner) {
        this.owner = _owner;
        auth[_owner] = true;
    }

    function receive() external payable {}

    function deposit(address _from, address _token, uint256 _amt) payable external {
        require(auth[_from], "Unauthorized deposit.");
        IERC20Token token = IERC20Token(_token);
        token.transferFrom(_from, address(this), _amt);
        if (token_addr[_token] == 0) {
            token_addr.push(_token);
        }
        deposited[_token] += _amt;
    }

    function getBasis() returns (address[] memory _tokens, uint256[] memory _bal) {
        require(auth[_from], "Unauthorizeq query.");
        address[] memory _tokens = token_addr;
        uint256[_tokens.length] memory _bal;
        for (uint i = 0; i < _tokens.length; i++) {
            _bal[i] = deposited[_tokens[i]];
        }
    }

    function callConnector(address _from, address _target, bytes _calldata) external payable {
        require(auth[_from], "Unauthorized connector call");
        delegate(_target, _calldata);
    }
}