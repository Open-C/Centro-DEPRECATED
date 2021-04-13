pragma solidity ^0.5.0;

contract ImToken{
    function balanceOf(address _user) public view returns(uint256);
    function principalBalanceOf(address _user) external view returns(uint256);
}