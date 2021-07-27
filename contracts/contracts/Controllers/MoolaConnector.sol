// SPDX-License-Identifier: ISC

pragma solidity >0.5.0;
import "../WalletFactory.sol";
import "../Interfaces/LendingPoolProvider.sol";


interface ILendingPool {
    function getUserReserveData(address _reserve, address _user) external view
        returns (
            uint256 currentATokenBalance,
            uint256 currentBorrowBalance,
            uint256 principalBorrowBalance,
            uint256 borrowRateMode,
            uint256 borrowRate,
            uint256 liquidityRate,
            uint256 originationFee,
            uint256 variableBorrowIndex,
            uint256 lastUpdateTimestamp,
            bool usageAsCollateralEnabled
        );
}

abstract contract MoolaConnector is WalletFactory {

	constructor(address _store, address _siphonAddress) WalletFactory(_store, _siphonAddress) {}

	string private constant mDEPOSIT = "deposit(address,uint256,uint16)";
	string private constant mREDEEM = "redeem(uint256)";

    function _getLendingPool() internal view returns (ILendingPool) {
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(store.getAddress("moolaProvider"));
        return ILendingPool(lpa.getLendingPool());
    }
    
    function _getPoolCore() internal view returns (address payable) {
        ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(store.getAddress("moolaProvider"));
        return lpa.getLendingPoolCore();
    }
    
    function getMoolaBalance(address _token, uint256 _walletID) public view
		returns (uint256 currentATokenBalance) {
		CentroWallet wallet = _getWallet(_walletID);
		ILendingPool moola = _getLendingPool();
		(currentATokenBalance, , , , , , , , , ) = moola.getUserReserveData(_token, address(wallet));
	}
	
	function moolaDeposit(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		ILendingPool moola = _getLendingPool();
		bytes memory data = abi.encodeWithSignature(mDEPOSIT, _token, _amount, 0);
		uint256 value = 0;
		if (_token == store.getEthAddress()) {
		    value = _amount;
		} else {
		    wallet.approve(msg.sender, _token, address(_getPoolCore()), _amount);
		}
		wallet.callContract(msg.sender, address(moola), data);
	}
	
	function moolaWithdraw(address _token, uint256 _amount, uint256 _walletID) external payable {
		CentroWallet wallet = _getWallet(_walletID);
		bytes memory data = abi.encodeWithSignature(mREDEEM, _amount);
		wallet.callContract(msg.sender, _token, data);
	}

}
