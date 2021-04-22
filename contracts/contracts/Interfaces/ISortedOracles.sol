pragma solidity ^0.5.0;

interface ISortedOracles {
	/**
	 * @notice Returns the median rate.
	 * @param token The address of the token for which the Celo Gold exchange rate is being reported.
	 * @return The median exchange rate for `token`.
	 */
	function medianRate(address token) external view returns (uint256, uint256);
}
