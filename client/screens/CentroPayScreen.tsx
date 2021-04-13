import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Container, Image, Separator, Text } from '../components/ThemedComponents'

export function CentroPayScreen() {
	return (
		<Container style={[layout.centered, layout.full]}>
			<Image source={require('../assets/images/centropay-thumbnail.png')} style={{height: 100}}></Image>
			<Separator />
			<Text style={text.p}>Coming Soon!</Text>
		</Container>
	)
}
