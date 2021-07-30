import { createStore, combineReducers } from "redux";
import { wallet } from "./wallet_store";
import { smartWallet } from "./smart_wallet";

export const reducer = combineReducers({
  wallet: wallet.reducer,
  smartWallet: smartWallet.reducer,
});

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
