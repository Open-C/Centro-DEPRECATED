import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView, View } from 'react-native'
import { Container, Separator, Text } from '../components/ThemedComponents'

export default function MoolaMarketScreen() {
	return (
		<ScrollView>
			<Container style={layout.centered}>
				<Text style={text.h1}>MoolaMarket</Text>
				<Separator />
			</Container>
		</ScrollView>
	)
}
