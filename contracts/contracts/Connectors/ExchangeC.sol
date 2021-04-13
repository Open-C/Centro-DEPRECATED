pragma solidity ^0.5.0;

import "../Interfaces/IExchange.sol";
import "../Interfaces/IERC20Token.sol";

interface CeloRegistry {
    function getAddressForString(string calldata identifier) external view returns (address);
}

contract ExchangeHelper {
    CeloRegistry cr = CeloRegistry(0x00000);
    function getExchange() internal view returns (address) {
        return cr.getAddressForString("Exchange");
    }
}

contract ExchangeConnector is ExchangeHelper{

    function sellCelo(uint256 _sellAmt, uint256 _minBuyAmt) external  {
        IExchange exch = IExchange(super.getExchange());
        exch.sell(_sellAmt, _minBuyAmt, true);
    }

    function buyCelo(uint256 _buyAmt, uint256 _maxSellAmt) external  {
        IExchange exch = IExchange(super.getExchange());
        exch.buy(_buyAmt, _maxSellAmt, false);
    }
}