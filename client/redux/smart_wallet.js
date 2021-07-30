import { createSlice, createAction } from "@reduxjs/toolkit";
import { Signer } from "ethers";

const initialState = {
  loading: false,
  error: false,
  alive: false,
  address: undefined,
  id: undefined,
  tokens: [],
  name: "",
  signer: undefined,
  provider: undefined,
};

export const smartWallet = createSlice({
  name: "smart_wallet",
  initialState,
  reducers: {
    initConnectWallet: (state) => ({
      ...state,
      loading: true,
      alive: false,
      error: "",
    }),
    walletConnectSuccess: (state, payload) => ({
      ...state,
      loading: false,
      alive: true,
      error: "",
      ...payload,
    }),
    walletConnectError: (state, { error }) => ({
      ...state,
      error,
    }),
    addSigner: (state, { signer }) => ({
      ...state,
      signer,
    }),
  },
});

export const smartWalletActions = smartWallet.actions;

export const createWallet = async (signer, walletStore, dispatch) => {
  const { celoProvider } = walletStore;
  //   const celoSigner = celoProvider.getSigner();

  const mainContract = walletStore.contracts.main;

  const contractWithSigner = mainContract.connect(signer);
  const tx = await contractWithSigner.newWallet("Name", {
    gasPrice: 0.5 * 10 ** 10,
    gasLimit: 2500000,
    nonce: signer.getTransactionCount(),
  });
  //   const signed = await signer.signTransaction(tx);
  //   const resp = await celoProvider.sendTransaction(signed);
  console.log(tx);
  console.log(await tx.wait());
};
