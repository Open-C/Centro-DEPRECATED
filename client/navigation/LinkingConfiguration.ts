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
