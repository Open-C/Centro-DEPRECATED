import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Container, Image, Spacer, Text } from '../components/ThemedComponents'

export default function PollenScreen() {
	return (
		<Container style={[layout.centered, layout.full]}>
			<Image source={require('../assets/images/pollen-thumbnail.png')} style={{height: 100}}></Image>
			<Spacer />
			<Text style={text.p}>Coming Soon!</Text>
		</Container>
	)
}
