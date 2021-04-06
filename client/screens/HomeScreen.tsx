import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView } from 'react-native'
import { Container, Separator, Text } from '../components/ThemedComponents'

export default function HomeScreen() {
	return (
		<ScrollView style={layout.column}>
			<Container style={layout.centered}>
				<Text style={text.h1}>Centro DeFi Wallet</Text>
				<Separator />
			</Container>
		</ScrollView>
	)
}
