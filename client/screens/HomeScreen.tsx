import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView } from 'react-native'
import { Text, Container } from '../components/Themed'

export default function HomeScreen() {
	return (
		<ScrollView style={{flexDirection: 'column'}}>
			<Container style={layout.centered}>
				<Text style={text.h1}>Centro DeFi Wallet</Text>
				<Container style={layout.hr} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			</Container>
		</ScrollView>
	)
}
