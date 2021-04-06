import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ScrollView } from 'react-native'
import { Text, Container, Separator } from '../components/Themed'

export default function AssetsScreen() {
	return (
		<ScrollView style={{flexDirection: 'column'}}>
			<Container style={layout.centered}>
				<Text style={text.h1}>Assets</Text>
				<Separator style={layout.hr} />
			</Container>
		</ScrollView>
	)
}
