pragma solidity ^0.5.0;

interface ILendingPool {
	function deposit(address, uint256, uint16) external payable;
	function redeemUnderlying(address, address, uint256, uint256) external;
	function getReserveData(address _reserve)
		external
		view
		returns (
			uint256 totalLiquidity,
			uint256 availableLiquidity,
			uint256 totalBorrowsStable,
			uint256 totalBorrowsVariable,
			uint256 liquidityRate,
			uint256 variableBorrowRate,
			uint256 stableBorrowRate,
			uint256 averageStableBorrowRate,
			uint256 utilizationRate,
			uint256 liquidityIndex,
			uint256 variableBorrowIndex,
			address aTokenAddress,
			uint40 lastUpdateTimestamp
		);
	function getUserAccountData(address _user)
		external
		view
		returns (
			uint256 totalLiquidityETH,
			uint256 totalCollateralETH,
			uint256 totalBorrowsETH,
			uint256 totalFeesETH,
			uint256 availableBorrowsETH,
			uint256 currentLiquidationThreshold,
			uint256 ltv,
			uint256 healthFactor
		);

	function getUserReserveData(address _reserve, address _user)
		external
		view
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
	function getReserves() external view returns (address[] memory);
}