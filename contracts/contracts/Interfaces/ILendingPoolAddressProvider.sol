pragma solidity ^0.5.0;

contract ILendingPoolAddressesProvider {

    function getLendingPool() public view returns (address);
    function setLendingPoolImpl(address _pool) public;

    function getLendingPoolCore() public view returns (address);
    function setLendingPoolCoreImpl(address _lendingPoolCore) public;
}