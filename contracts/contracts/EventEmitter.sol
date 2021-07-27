// SPDX-License-Identifier: ISC

pragma solidity ^0.8.0;
import "./Storage.sol";

contract EventEmitter {
    Storage store;
    event DepositMade(address wallet, address token, uint256 amount);
    event WithdrawalMade(address wallet, address token, uint256 amount);
    event WalletCreated(address user, address wallet, bool isFirstWallet);
    event MoolaDeposit(address wallet, address tokenDeposited, uint256 amount);
    event MoolaWithdrawal(address wallet, address tokenWithdrawn, uint256 amount);
    event TokenReceived(address wallet, address token, uint256 amount);
    event UbeSwap(address wallet, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event UbeLiquidityAdded(address wallet, address lpToken, uint256 amount);
    event UbeLiquidityRemoved(address wallet, address lpToken, uint256 amount);
    event UbeFarmDeposited(address wallet, address farm, address lpToken, uint256 amount);
    event UbeFarmWithdrawn(address wallet, address farm, address lpToken, uint256 amount);
    event UbeFarmClaimed(address wallet, address farm, uint256 ubeClaimed);

    constructor (address _store) public {
        store = Storage(_store);
    }

    modifier canEmit() {
        require (store.canEmitEvents(msg.sender), "Address is not authorized to emit events");
        _;
    }

    function emitDepositMade(address wallet, address token, uint256 amount) canEmit public {
        emit DepositMade(wallet, token, amount);
    }

    function emitWithdrawalMade(address wallet, address token, uint256 amount) canEmit public {
        emit WithdrawalMade(wallet, token, amount);
    }

    function emitWalletCreated(address user, address wallet, bool isFirstWallet) canEmit public {
        emit WalletCreated(user, wallet, isFirstWallet);
    }

    function emitMoolaDeposit(address wallet, address tokenDeposited, uint256 amount) canEmit public {
        emit MoolaDeposit(wallet, tokenDeposited, amount);
    }

    function emitMoolaWithdrawal(address wallet, address tokenWithdrawn, uint256 amount) canEmit public {
        emit MoolaWithdrawal(wallet, tokenWithdrawn, amount);
    }

    function emitTokenReceived(address wallet, address token, uint256 amount) canEmit public {
        emit TokenReceived(wallet, token, amount);
    }

    function emitUbeSwap(address wallet, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut) canEmit public {
        emit UbeSwap(wallet, tokenIn, tokenOut, amountIn, amountOut);
    }

    function emitUbeLiquidityAdded(address wallet, address lpToken, uint256 amount) canEmit public {
        emit UbeLiquidityAdded(wallet, lpToken, amount);
    }

    function emitUbeLiquidityRemoved(address wallet, address lpToken, uint256 amount) canEmit public {
        emit UbeLiquidityRemoved(wallet, lpToken, amount);
    }

    function emitUbeFarmDeposited(address wallet, address farm, address lpToken, uint256 amount) canEmit public {
        emit UbeFarmDeposited(wallet, farm, lpToken, amount);
    }

    function emitUbeFarmWithdrawn(address wallet, address farm, address lpToken, uint256 amount) canEmit public {
        emit UbeFarmWithdrawn(wallet, farm, lpToken, amount);
    }

    function emitUbeFarmClaimed(address wallet, address farm, uint256 ubeClaimed) canEmit public {
        emit UbeFarmClaimed(wallet, farm, ubeClaimed);
    }
}