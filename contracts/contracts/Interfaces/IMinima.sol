// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;

abstract contract IMinima {
    function getExpectedOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    )
    external
    view
    returns (
      uint256 amountOut,
      address[] memory tokenPath,
      address[] memory exchangePath
    );

    function swapOnChain(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        address recipient
  ) external returns (uint256);
}