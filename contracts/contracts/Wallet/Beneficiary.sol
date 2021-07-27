// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

///@notice Beneficiaries are not currently implemented in current Centro V1

contract Beneficiary {
    address private owner;
    address private target;
    uint private rate; // On a scale 1 - 10000
    mapping (address => uint256) prevBasis;
    address[] tokens;
    
    constructor(address _target, uint _rate, address[] memory _tokens, uint256[] memory _balances) public {
        owner = msg.sender;
        target = _target;
        rate = _rate;
        tokens = _tokens;
        for (uint i = 0; i < _tokens.length; i++) {
            prevBasis[_tokens[i]] = _balances[i];
        }
    }
    
    modifier isOwner() {
        require(msg.sender == owner, "Only the owner can interact with this");
        _;
    }
    
    modifier isAuth() {
        require(msg.sender == owner || msg.sender == target, "Unauthorized");
        _;
    }
    
    function _incrementBasis(address _token, uint256 _amount) internal {
        prevBasis[_token] += _amount;
    }
    
    function _decrementBasis(address _token, uint256 _amount) internal {
        prevBasis[_token] = prevBasis[_token] - _amount;
    }
    
    function incrementBasis(address _token, uint256 _amount) isOwner external {
        _incrementBasis(_token, _amount);
    }
    
    function decrementBasis(address _token, uint256 _amount) isOwner external {
        _decrementBasis(_token, _amount);
    }
    
    function getAmountDue(address[] memory _tokens, uint256[] memory _balances) isOwner external returns (uint256[] memory _owed) {
        _owed = new uint256[](_tokens.length);
        for (uint i = 0; i < _tokens.length; i++) {
            uint256 diff = _balances[i] - prevBasis[_tokens[i]];
            _owed[i] = uint256(diff * rate / 10000);
            prevBasis[_tokens[i]] = _balances[i];
        }
    }
        
}