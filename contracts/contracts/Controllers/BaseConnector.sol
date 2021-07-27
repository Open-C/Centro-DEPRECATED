// SPDX-License-Identifier: ISC

pragma solidity ^0.8.0;

// To-Do: Refactor connectors so that its not a huge mess of inheritance...
// For now, priority is getting it functional for integrating.

contract BaseConnector {
    address walletFactory;

    constructor(address _factory) {
        walletFactory = _factory;
    }

    // function _getWallet(uint256 _walletID) internal view returns (CentroWallet) {
	// 	uint256 walletID = _walletID == 0 ? currentWallet[msg.sender] : _walletID;
	// 	require(walletID != 0, "Provide a wallet id, or persist a wallet.");
	// 	address wallet;
	// 	string memory name;
	// 	(name, wallet) = getWallet(walletID);
	// 	return (CentroWallet(wallet));
	// }

}