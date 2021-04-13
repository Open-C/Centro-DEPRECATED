pragma solidity ^0.5.0;

import "../Interfaces/ILendingPool.sol";
import "../Interfaces/ILendingPoolAddressProvider.sol";
import "../Interfaces/IERC20Token.sol";

contract MoolaHelper {
    ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(0x6EAE47ccEFF3c3Ac94971704ccd25C7820121483);

    function getLendingPool() internal view returns (address) {
        return lpa.getLendingPool();
    }
} 

contract MoolaConnector is MoolaHelper{

    function deposit(address _token, uint256 _amt) external payable {
        ILendingPool moola = ILendingPool(getLendingPool());
        IERC20Token token = IERC20Token(_token);
        uint256 amt = _amt == uint(-1) ? token.balanceOf(address(this)) : _amt;
        require(amt <= token.balanceOf(address(this)), "Not enough moneys.");
        token.approve(address(moola), _amt);
        moola.deposit(_token, _amt, 0);
    }

    function withdraw(address _token, uint256 _amt) external payable {
        ILendingPool moola = ILendingPool(getLendingPool());
        moola.redeemUnderlying(_token, address(this), _amt, 0);
    }

    function getBalance(address[] calldata _tokens) external view returns (uint256[] memory) {
        ILendingPool moola = ILendingPool(getLendingPool());
        uint256[] memory balances = new uint256[](_tokens.length);
        for (uint i = 0 ; i < _tokens.length; i++) {
            (uint256 currentATokenBalance,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ) = moola.getUserReserveData(_tokens[i], address(this));
            balances[i] = currentATokenBalance;
        }
        return (balances);
    }
}