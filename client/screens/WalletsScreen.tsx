import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView, View } from 'react-native'
import { Card } from '../components/ThemedComponents'
import { WalletStatus } from '../components/WalletStatus'

export function WalletsScreen() {
	return (
		<ScrollView style={layout.container}>
			<Card>
				<WalletStatus />
			</Card>
		</ScrollView>
	)
}
