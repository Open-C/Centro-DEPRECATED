pragma solidity >0.5.0;

interface IExchange  {
    function getBuyTokenAmount(uint256 sellAmount, bool sellGold) external view returns (uint256);

    function getSellTokenAmount(uint256 buyAmount, bool sellGold) external view returns (uint256);

    function sell(uint256 sellAmount, uint256 minBuyAmount, bool sellGold) external returns (uint256);

    function buy(uint256 buyAmount, uint256 maxSellAmount, bool buyGold) external returns (uint256);
}