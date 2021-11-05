import * as Linking from "expo-linking";

export const LinkingConfiguration = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          AssetsTab: {
            screens: {
              AssetsScreen: "wallet",
            },
          },
          AppsTab: {
            screens: {
              AppsScreen: "home",
              MoolaMarketScreen: "moolamarket",
              MentoScreen: "mento",
              CentroPayScreen: "pay",
              UbeswapScreen: "celoswap",
              BlockExplorerScreen: "explorer",
              PollenScreen: "pollen",
              CarbonOffsetScreen: "carbonoffset",
              ImpactMarketScreen: "impactmarket",
              PoofCashScreen: "poofcash",
            },
          },
          SettingsTab: {
            screens: {
              SettingsScreen: "settings",
              WalletsScreen: "wallets",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
