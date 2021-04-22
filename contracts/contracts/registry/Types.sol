pragma solidity >0.5.0;

interface Types {
	struct Wallet {
		string name;
		string role;
		address addr;
		address owner;
		uint256 id;
	}
}