import * as React from "react";

import { layout, text } from "../styles/styles";
import { View, Modal, StyleSheet, FlatList } from "react-native";
import { BlurView } from "expo-blur";
import defaultTokenList from "@ubeswap/default-token-list";

import {
  ViewProps,
  Card,
  Text,
  Button,
  Spacer,
  Image,
  ListSeparator,
  ButtonSmall,
  TextInput,
} from "./ThemedComponents";

type PropTypes = ViewProps & {
  pooledTokens: string[];
  tokenURL: string[];
  totalRewards: {
    token: string;
    rate: string;
  }[];
  apr: string;
  totalLiquidity: string;
  currentDeposited: string[];
  onDeposit?: (amounts: string[]) => void;
  individualRewards?: {
    token: string;
    rate: string;
  }[];
  exchange: string;
  totalDeposited: string;
};

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

const FarmCard = (props: PropTypes) => {
  const {
    pooledTokens,
    totalRewards,
    apr,
    totalLiquidity,
    currentDeposited,
    tokenURL,
    onDeposit,
    individualRewards,
    exchange,
    totalDeposited,
  } = props;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [tokenAmounts, setTokenAmounts] = React.useState(
    new Array(pooledTokens.length).fill(0)
  );
  const tokenInfo: { [s: string]: any } = {};

  const InfoRow = ({ left, right }: { left: string; right: string }) => (
    <View style={[layout.row, styles.infoRow]}>
      <Text>{left}</Text>
      <Text>{right}</Text>
    </View>
  );

  //const NETWORK = "mainnet";
  const tokens = defaultTokenList.tokens;
  tokens.forEach(
    (token) =>
      (tokenInfo[token.symbol] = {
        ...token,
      })
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView style={[styles.blur, styles.centeredView]} intensity={50}>
          <Card outerStyle={styles.tokenListContainer}>
            <View style={[layout.row, { padding: 10 }]}>
              <Text style={[text.h2, { flex: 1 }]}>Input Amounts</Text>
              <ListSeparator />
              <ButtonSmall onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
              </ButtonSmall>
            </View>
            <FlatList
              //style={layout.cardList}
              data={pooledTokens}
              renderItem={({ item: token, index }) => (
                <View style={[layout.row, styles.infoRow]}>
                  <Image
                    source={{ uri: tokenURL[index] }}
                    style={[
                      layout.assetIcon,
                      styles.tokenImage,
                      layout.shadowed,
                    ]}
                  />
                  <Spacer />
                  <Text style={text.h3}>{token}</Text>
                  <Spacer />
                  <TextInput
                    style={[text.h2, { maxWidth: "50%" }]}
                    keyboardType="numeric"
                    defaultValue="0.00"
                    value={tokenAmounts[index]}
                    onChangeText={(text) => {
                      setTokenAmounts(
                        tokenAmounts.map((v, i) => (i == index ? text : v))
                      );
                    }}
                    placeholder="0.00"
                  />
                </View>
              )}
              ItemSeparatorComponent={ListSeparator}
            />
            <View style={layout.centered}>
              <Button onPress={() => setModalVisible(false)}>Deposit</Button>
            </View>
          </Card>
        </BlurView>
      </Modal>
      <Card>
        <View style={[layout.row, styles.infoRow]}>
          <Text style={text.h2}>{pooledTokens.join("<>")}</Text>
          <Text style={text.strong}>{exchange}</Text>
        </View>
        <Spacer />
        <InfoRow left="Total Deposited" right={totalLiquidity} />
        {totalRewards.map(({ token, rate }) => (
          <InfoRow left={`${token} rate`} right={`${rate} ${token} / week`} />
        ))}
        <InfoRow
          left={`${totalRewards.length > 1 ? "Combined " : ""}APR`}
          right={`${apr}%`}
        />
        <Spacer />
        <View
          style={[
            layout.listSeparator,
            layout.centered,
            { backgroundColor: "#FFF", marginBottom: 8 },
          ]}
        />
        <InfoRow
          left="Your Rate"
          right={`${individualRewards
            ?.map(({ token, rate }) => `${rate} ${token}`)
            .join("+")} / week`}
        />
        <InfoRow left="Your Stake" right={`$${totalDeposited}`} />
        <View style={[layout.row, layout.centered]}>
          <Button onPress={() => setModalVisible(true)}>
            {totalDeposited === "0" ? "Deposit" : "Manage"}
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default FarmCard;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
  },
  blur: {
    width: "100%",
    height: "100%",
  },
  tokenListContainer: {
    width: "95%",
    height: "80%",
    margin: "auto",
    marginBottom: -10,
    padding: 5,
  },
  tokenImage: {
    borderRadius: 100,
  },
  infoRow: {
    width: "95%",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});
