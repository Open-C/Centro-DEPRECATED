pragma solidity >0.5.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract ContractCaller {
	function delegate(address _target, bytes memory _calldata) internal returns (bytes memory response) {
		require(_target != address(0), "Target invalid!");
		(bool success, bytes memory returnData) = _target.delegatecall(_calldata);

		assembly {
			if eq(success, 0) {
				revert(add(returnData, 32), returndatasize())
			}
		}

		return returnData;
	}

	function callContract(address payable _target, uint256 _value, bytes memory _calldata) internal returns (bytes memory response) {
		require(_target != address(0), "Target invalid!");
		(bool success, bytes memory returnData) = _target.call{value: _value}(_calldata);

		assembly {
			if eq(success, 0) {
				revert(add(returnData, 32), returndatasize())
			}
		}
		return returnData;
	}

	function approveToken(address _token, address payable _toApprove, uint256 _amt) internal {
		require(_token != address(0), "Invalid token address");
		require(_toApprove != address(0), "Invalid approvee");
		IERC20(_token).approve(_toApprove, _amt);
	}
}