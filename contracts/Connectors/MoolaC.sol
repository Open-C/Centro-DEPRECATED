pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../Interfaces/ILendingPool.sol";
import "../Interfaces/ILendingPoolAddressProvider.sol";
import "../Interfaces/IERC20Token.sol";

contract MoolaHelper is ReentrancyGuard {
    ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(0x6EAE47ccEFF3c3Ac94971704ccd25C7820121483);

    function getLendingPool() internal view returns (address) {
        return lpa.getLendingPool();
    }
}

contract MoolaConnector is MoolaHelper{
    using SafeMath for uint256;
    using Address for address;


    function deposit(address _token, uint256 _amt) external payable {
        ILendingPool moola = ILendingPool(getLendingPool());
        IERC20Token token = IERC20Token(_token);
        uint256 amt = _amt == -1 ? token.balanceOf(address(this)) : _amt;
        require(amt <= token.balanceOf(address(this)), "Not enough moneys.");
        token.approve(address(moola), _amt);
        moola.deposit(_token, _amt);
    }

    function withdraw(address _token, uint256 _amt) external payable {
        ILendingPool moola = ILendingPool(getLendingPool());
        IERC20Token token = IERC20Token(_token);
        moola.redeemUnderlying(_token, address(this), _amt, 0);
    }
}