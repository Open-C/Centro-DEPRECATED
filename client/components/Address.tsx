import * as React from 'react'

import { text } from '../styles/styles'

import { Text } from '../components/ThemedComponents'
import { TouchableOpacity } from 'react-native-gesture-handler'

export function Address({address}) {
	return (
		<TouchableOpacity>
			<Text style={[text.address]}>{address}</Text>
		</TouchableOpacity>
	)
}
