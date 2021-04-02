pragma solidity ^0.5.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../Interfaces/IExchange.sol";
import "../Interfaces/IERC20Token.sol";

interface CeloRegistry {
    function getAddressForString(string calldata identifier) external view returns (address);
}

contract ExchangeHelper is ReentrancyGuard {
    CeloRegistry cr = CeloRegistry(0x00000);
    function getExchange() private returns (address) {
        return cr.getAddressForString("Exchange");
    }
}

contract ExchangeConnecter is ExchangeHelper{
    using Address for address;

    function sellCelo(uint256 _sellAmt, uint256 _minBuyAmt) external  {
        IExchange memory exch = IExchange(getExchange());
        exch.sell(_sellAmt, _minBuyAmt, true);
    }

    function buyCelo(uint256 _buyAmt, uint256 _maxSellAmt) external  {
        IExchange memory exch = IExchange(getExchange());
        exch.buy(_buyAmt, _maxSellAmt, false);
    }
}