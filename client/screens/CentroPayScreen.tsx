import * as React from 'react'

import { layout, text } from '../styles/styles'

import { Button, ScrollView, View } from 'react-native'
import { Container, Separator, Text } from '../components/ThemedComponents'

export default function CentroPayScreen() {
	return (
		<ScrollView>
			<Container style={[layout.centered]}>
				<Button title="Whee" style={text.h1} />
				<Separator />
			</Container>
		</ScrollView>
	)
}
