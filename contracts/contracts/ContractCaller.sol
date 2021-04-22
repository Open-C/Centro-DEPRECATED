pragma solidity >0.5.0;

contract ContractCaller {
	function delegate(address _target, bytes memory _calldata) internal returns (bytes memory response) {
		require(_target != address(0), "Target invalid!");
		(bool success, bytes memory returnData) =
			_target.delegatecall(_calldata);

		assembly {
			if eq(success, 0) {
				revert(add(returnData, 32), returndatasize())
			}
		}

		return returnData;
		// assembly{
		// 	let succeeded := delegatecall(gas(), _target, add(_calldata, 0x20), mload(_calldata), 0, 0)
		// 	let size := returndatasize()

		// 	response := mload(0x40)
		// 	mstore(0x40, add(response, and(add(add(size, 0x20), 0x1f), not(0x1f))))
		// 	mstore(response, size)
		// 	returndatacopy(add(response, 0x20), 0, size)

		// 	switch iszero(succeeded)
		// 		case 1 {
		// 			// throw if delegatecall failed
		// 			returndatacopy(0x00, 0x00, size)
		// 			revert(0x00, size)
		// 		}
		// }
	}

	function sendCelo(address payable _target, uint256 _value, bytes memory _calldata) internal returns (bytes memory response) {
		require(_target != address(0), "Target invalid!");
		(bool success, bytes memory returnData) =
			_target.call.value(_value)(_calldata);

		assembly {
			if eq(success, 0) {
				revert(add(returnData, 32), returndatasize())
			}
		}

		return returnData;
	}
}