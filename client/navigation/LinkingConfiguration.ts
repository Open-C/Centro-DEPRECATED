import * as Linking from 'expo-linking'

export default {
	prefixes: [Linking.makeUrl('/')],
	config: {
		screens: {
			Root: {
				screens: {
					AssetsTab: {
						screens: {
							AssetsScreen: 'wallet',
						},
					},
					AppsTab: {
						screens: {
							AppsScreen: 'home',
							MoolaMarketScreen: 'moolamarket',
							MentoScreen: 'mento',
							CentroPayScreen: 'pay',
							UbeswapScreen: 'ubeswap',
							BlockExplorerScreen: 'explorer',
							PollenScreen: 'pollen',
							PoofCashScreen: 'poofcash',
						},
					},
					SettingsTab: {
						screens: {
							SettingsScreen: 'settings',
						},
					},
				},
			},
			NotFound: '*',
		},
	},
}
