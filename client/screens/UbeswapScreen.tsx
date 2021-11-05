import * as React from "react";

import { LayoutAnimation, Platform, StyleSheet } from "react-native";

import { layout, text } from "../styles/styles";
import TokenSelector from "../components/TokenSelector";
import { TabView, SceneMap } from "react-native-tab-view";
import FarmCard from "../components/FarmCard";

import {
  FlatList,
  KeyboardAvoidingView,
  SectionList,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Button,
  Card,
  CardSection,
  Container,
  ListSeparator,
  Separator,
  SectionSpacer,
  Spacer,
  Text,
  Image,
} from "../components/ThemedComponents";
import { Toggle } from "../components/Toggle";
import { WalletStatus } from "../components/WalletStatus";
import { TokenDeposit } from "../components/TokenDeposit";
import { TokenWithdraw } from "../components/TokenWithdraw";

import { tokenBalances } from "../state/tokenBalances";

const CeloSwapColors = {
  light: {
    accent1: "#52d07f",
    accent2: "#fcefa9",
  },
  dark: {
    accent1: "#52d07f",
    accent2: "#fcefa9",
  },
};

export function CeloSwapScreen() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 1, title: "Swap" },
    { key: 2, title: "Second" },
  ]);

  const SwapTab = () => (
    <View style={layout.container}>
      <TokenSelector selectedToken="" inputValue="" isSwapFrom={true} />
      <Spacer />
      <TokenSelector selectedToken="" inputValue="" isSwapFrom={false} />
      <Spacer />
      <View style={[layout.centered, layout.row]}>
        <Button style={styles.swapButton}>Swap</Button>
      </View>
    </View>
  );

  const FarmTab = () => (
    <View style={layout.container}>
      <FlatList
        //style={layout.cardList}
        data={farmData}
        renderItem={({ item }) => <FarmCard {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10, width: 1 }} />}

        // pooledTokens={["cUSD", "USDT", "DAI"]}
        // tokenURL={["", "", ""]}
        // totalRewards={[
        //   {
        //     token: "POOF",
        //     rate: "12312312",
        //   },
        // ]}
        // apr="235"
        // totalLiquidity="$123,000,000"
        // currentDeposited={["100", "100", "100"]}
        // individualRewards={[
        //   {
        //     token: "POOF",
        //     rate: "123123123",
        //   },
        // ]}
        // exchange="Mobius"
        // totalDeposited="3500"
      />
    </View>
  );

  const renderScene = SceneMap({
    first: SwapTab,
    second: FarmTab,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "position" : "height"}
    >
      <ScrollView>
        <Button onPress={() => setTabIndex(tabIndex == 1 ? 0 : 1)}>
          Switch to {tabIndex == 0 ? "Farm" : "Swap"}
        </Button>
        {tabIndex == 0 ? <SwapTab /> : <FarmTab />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const farmData = [
  {
    pooledTokens: ["cUSD", "USDT", "DAI"],
    tokenURL: ["", "", ""],
    totalRewards: [
      {
        token: "POOF",
        rate: "12312312",
      },
    ],
    apr: "235",
    totalLiquidity: "$123,000,000",
    currentDeposited: ["100", "100", "100"],
    individualRewards: [
      {
        token: "POOF",
        rate: "123123123",
      },
    ],
    exchange: "Mobius",
    totalDeposited: "3500",
  },
  {
    pooledTokens: ["mcUSD", "mcEUR"],
    tokenURL: ["", "", ""],
    totalRewards: [
      {
        token: "MOO",
        rate: "50,840",
      },
      {
        token: "UBE",
        rate: "13,080",
      },
    ],
    apr: "35",
    totalLiquidity: "$2,392,697",
    currentDeposited: ["100", "100", "100"],
    exchange: "Ubeswap",
    totalDeposited: "0",
  },
  {
    pooledTokens: ["POOF", "UBE"],
    tokenURL: ["", "", ""],
    totalRewards: [
      {
        token: "POOF",
        rate: "38,642",
      },
      {
        token: "UBE",
        rate: "45,780",
      },
    ],
    apr: "264",
    totalLiquidity: "$120,570",
    currentDeposited: ["100", "100", "100"],
    exchange: "Ubeswap",
    individualRewards: [
      {
        token: "POOF",
        rate: "647.4",
      },
      {
        token: "UBE",
        rate: "770.6",
      },
    ],
    totalDeposited: "2,029",
  },
  {
    pooledTokens: ["cBTC", "wBTC", "mBTC"],
    tokenURL: ["", "", ""],
    totalRewards: [
      {
        token: "MOBI",
        rate: "50,000",
      },
    ],
    apr: "999",
    totalLiquidity: "$10,000,000",
    currentDeposited: ["100", "100", "100"],
    individualRewards: [
      {
        token: "MOBI",
        rate: "20,000",
      },
    ],
    exchange: "Mobius",
    totalDeposited: "15,000",
  },
];

const styles = StyleSheet.create({
  swapButton: {
    padding: 5,
  },
});
