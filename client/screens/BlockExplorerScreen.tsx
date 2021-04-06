import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView, View } from 'react-native'
import { Container, Separator, Text } from '../components/ThemedComponents'

export default function BlockExplorerScreen() {
	return (
		<ScrollView>
			<View style={layout.column}>
				<Container style={layout.centered}>
					<Text style={text.h1}>Block Explorer</Text>
					<Separator />
				</Container>
			</View>
		</ScrollView>
	)
}
