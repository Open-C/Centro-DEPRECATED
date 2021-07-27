// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

abstract contract ILendingPoolAddressesProvider {
    function getLendingPool() public view virtual returns (address);
    function getLendingPoolCore() public view virtual returns (address payable);
}