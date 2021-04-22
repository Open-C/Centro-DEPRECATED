pragma solidity ^0.5.0;

import "../interfaces/IExchange.sol";
import "../interfaces/IERC20Token.sol";

interface CeloRegistry {
	function getAddressForString(string calldata identifier) external view returns (address);
}

contract ExchangeHelper {
	CeloRegistry celoRegistry = CeloRegistry(0x00000);

	function getExchange() internal view returns (address) {
		return celoRegistry.getAddressForString("Exchange");
	}
}

contract ExchangeConnector is ExchangeHelper {
	function sellCelo(uint256 _sellAmount, uint256 _minBuyAmount) external  {
		IExchange exchange = IExchange(super.getExchange());
		exchange.sell(_sellAmount, _minBuyAmount, true);
	}

	function buyCelo(uint256 _buyAmount, uint256 _maxSellAmount) external  {
		IExchange exchange = IExchange(super.getExchange());
		exchange.buy(_buyAmount, _maxSellAmount, false);
	}
}