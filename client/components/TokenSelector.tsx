import * as React from "react";

import { layout, text, themes } from "../styles/styles";
import { useColorScheme } from "../hooks/useColorScheme";
import { BigNumber } from "@ethersproject/bignumber";
import {
  Text as DefaultText,
  View,
  Image as DefaultImage,
  TextInput as DefaultTextInput,
  Modal,
  StyleSheet,
  FlatList,
  SectionList,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Slider as DefaultSlider } from "react-native-elements";
import defaultTokenList from "@ubeswap/default-token-list";
import { tokenBalances } from "../state/tokenBalances";

import {
  useThemeColor,
  ViewProps,
  Card,
  CardSection,
  Text,
  Button,
  Spacer,
  Image,
  ListSeparator,
  ButtonSmall,
} from "./ThemedComponents";

type PropTypes = ViewProps & {
  selectedToken: string;
  inputValue: string;
  isSwapFrom?: boolean;
  onSelect?: (tokenSymbol: string) => void;
  onChangeAmount?: (value: string) => void;
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

const TokenSelector = (props: PropTypes) => {
  const { selectedToken, inputValue, isSwapFrom, onSelect, onChangeAmount } =
    props;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selected, setSelected] = React.useState(selectedToken);
  const [tokenAmount, setTokenAmount] = React.useState(inputValue);
  const tokenInfo: { [s: string]: any } = {};

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
              <Text style={[text.h2, { flex: 1 }]}>Select a Token</Text>
              <ListSeparator />
              <ButtonSmall onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
              </ButtonSmall>
            </View>
            <ScrollView>
              <FlatList
                style={layout.cardList}
                data={tokens}
                renderItem={({ item: token }) => (
                  <Pressable
                    style={[layout.row, layout.cardListItem]}
                    onPress={() => {
                      setSelected(token.symbol);
                      setModalVisible(false);
                    }}
                  >
                    <Image
                      source={{ uri: token.logoURI }}
                      style={[
                        layout.assetIcon,
                        styles.tokenImage,
                        layout.shadowed,
                      ]}
                    />
                    <Spacer />
                    <View style={[layout.column, { flex: 1 }]}>
                      <Text style={text.h3}>{token.name}</Text>
                      <Text style={text.caption}>{token.symbol}</Text>
                    </View>
                    <Spacer />
                    <Text style={text.h3}>{10}</Text>
                  </Pressable>
                )}
                ItemSeparatorComponent={ListSeparator}
              />
            </ScrollView>
          </Card>
        </BlurView>
      </Modal>
      <Card style={styles.inputContainer}>
        <Text>{isSwapFrom ? "From" : "To"}</Text>
        <View style={[layout.row, styles.swapInfo]}>
          <TextInput
            style={[
              text.h2,
              {
                color: useThemeColor({ light: "black", dark: "white" }, "text"),
              },
            ]}
            keyboardType="numeric"
            defaultValue="0.00"
            value={tokenAmount}
            onChangeText={(text) => {
              setTokenAmount(text);
              onChangeAmount && onChangeAmount(text);
            }}
            placeholder="0.00"
          />
          <Button
            onPress={() => setModalVisible(true)}
            style={[styles.dropDownButton, layout.row]}
            textOverride={{
              light: "#00000",
              dark: "#00000",
            }}
            background={{
              light: CeloSwapColors.light.accent1,
              dark: CeloSwapColors.dark.accent1,
            }}
          >
            {selected ? (
              <View style={layout.row}>
                <Image
                  source={{ uri: tokenInfo[selected].logoURI }}
                  style={[layout.assetIcon, styles.tokenImage, layout.shadowed]}
                />
                <Spacer />
                <Text style={text.h3}>{tokenInfo[selected].symbol}</Text>
              </View>
            ) : (
              <View style={styles.centerStupidText}>
                <Text style={[text.h3, styles.stupidText]}>Select a Token</Text>
              </View>
            )}
            <View style={styles.dropperV}>
              <Text style={[text.h2, { color: "#000000" }]}>V</Text>
            </View>
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default TokenSelector;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 22,
  },
  tokenImage: {
    borderRadius: 100,
  },
  tokenListContainer: {
    width: "95%",
    height: "60%",
    margin: "auto",
    marginBottom: -10,
    padding: 5,
  },
  inputContainer: {
    display: "flex",
    minHeight: 100,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  dropDownButton: {
    marginLeft: "auto",
    alignContent: "center",
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  blur: {
    width: "100%",
    height: "100%",
  },
  swapInfo: {
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  centerStupidText: {
    display: "flex",
    height: "100%",
  },
  stupidText: {
    marginTop: "auto",
    marginBottom: "auto",
    color: "#000000",
  },
  dropperV: {
    padding: 10,
    paddingRight: 0,
    marginRight: -10,
    color: "#000000",
  },
});
