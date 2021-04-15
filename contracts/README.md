Storage address: "0x2c5bCde385703754D91a2645767ef0803C21c6A5"

CentroMain - Forward-facing Contract
----------------------------------------------------------------------
newWallet(String name)
* Creates a wallet for the user initiating the call
* Sets new wallet to be the current wallet for user
-----------------------------------------------------------------------
getAccountIds()
* Returns an array of ids, where each id represents a smart wallet owned by the user
------------------------------------------------------------------------
persistWallet(uint256 id)
* Sets the default wallet for a user
* User must be the owner of the wallet
---------------------------------------------------------------------------
getAccountOverview()
* Returns an array of Wallet objects owned by the user
* Return type:
   * [
{ String name,
String role,
Address addr,
Address owner,
Uint256 id }
]

---------------------------------------------------------------------------
getWalletBallance(uint256 wId)
   * Returns an array of token addresses, and balances of the corresponding token
   * To use a persisted wallet, use wId = 0
   * Return type:
      * {
Tokens : [0x988321, 0x…..]
Balances: [10, 2]
}

---------------------------------------------------------------------------
deposit(address token, uint256 amt, uint256 wId)
* Deposits an amt of token into the wallet corresponding to wId
* To use a persisted wallet, use wId = 0
      
---------------------------------------------------------------------------
moolaDeposit(address tok, uint256 amt, uint256 wId)
* Transfers funds to Moola
* To use a persisted wallet, wId = 0
      
---------------------------------------------------------------------------
withdraw(address tok, uint256 amt, uint256 wId)
* Withdraws amt of token from the smart wallet corresponding to wId
* To use a persisted wallet, wId = 0
      
---------------------------------------------------------------------------
moolaWithdraw(address tok, uint256 amt, uint256 wId)
* Transfer funds from moola back into smart wallet
* wId = 0 to use persisted wallet for user
      
---------------------------------------------------------------------------
buyCelo(uint256 amt, uint256 maxSellAmount, uint256 wId)
* Places a limit order for amt of celo, setting the maximum amount of cUSD to sell
* wId = 0 to use persisted wallet
      
---------------------------------------------------------------------------
sellCelo(uint256 amt, uint256 minBuyAmount, uint256 wId)
* Places a limit order to sell amt of celo for a minimum amount of cUSD in exchange
* wId = 0 to use persisted wallet
      
---------------------------------------------------------------------------
send(address token, uint256 receiver, uint256 amt, uint256 wId)
* Transfers amt of token to the smart wallet corresponding to receiver.
* wId = 0 to use persisted wallet
