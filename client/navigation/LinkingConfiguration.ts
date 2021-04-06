import * as Linking from 'expo-linking'

export default {
	prefixes: [Linking.makeUrl('/')],
	config: {
		screens: {
			Root: {
				screens: {
					HomeTab: {
						screens: {
							HomeScreen: 'home',
							MoolaMarketScreen: 'moolamarket',
							MentoScreen: 'mento',
							BlockExplorerScreen: 'explorer',
							UbeswapScreen: 'ubeswap',
							PoofCashScreen: 'poofcash',
							PollenScreen: 'pollen',
						},
					},
					AssetsTab: {
						screens: {
							AssetsScreen: 'assets',
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
