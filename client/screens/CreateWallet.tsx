import * as React from "react";

import { layout, text } from "../styles/styles";

import { ScrollView, View } from "react-native";
import { Card } from "../components/ThemedComponents";

import * as redux from "react-redux";
import { useContractKit } from "@celo-tools/use-contractkit";
import { ContractKit } from "@celo/contractkit";

interface PropTypes {
  initConnectWallet: (payload: any) => any;
  walletConnectSuccess: (payload: any) => any;
  walletConnectFailed: (payload: any) => any;
  kit: ContractKit;
}

export function WalletsScreen(props: PropTypes) {
  const { connect, address } = useContractKit();
  const { initConnectWallet, walletConnectSuccess, walletConnectFailed, kit } =
    props;

  const connectOwnWallet = async () => {
    initConnectWallet("");
    try {
      await connect();
      walletConnectSuccess({
        address,
      });
    } catch (e) {
      walletConnectFailed({ e });
    }
  };

  const createNewEoa = async () => {
    initConnectWallet("");
    try {
      const account = await kit.web3.eth.accounts.create();
      walletConnectSuccess({
        address: account.address,
      });
      kit.addAccount(account.privateKey);
    } catch (e) {
      walletConnectFailed(e);
    }
  };

  return (
    <ScrollView style={layout.container}>
      <Card style={layout.centered}></Card>
    </ScrollView>
  );
}
