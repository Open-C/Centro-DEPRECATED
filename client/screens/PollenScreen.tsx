import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Image, Spacer, Text } from '../components/ThemedComponents'

export default function PollenScreen() {
	return (
		<View style={[layout.centered, layout.full]}>
			<Image source={require('../assets/images/pollen-thumbnail.png')} style={{height: 100}}></Image>
			<Spacer />
			<Text style={text.p}>Coming Soon!</Text>
		</View>
	)
}
