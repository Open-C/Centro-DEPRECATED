import * as React from 'react'

import { text } from '../styles/styles'

import { Text } from '../components/ThemedComponents'
import { TouchableOpacity } from 'react-native-gesture-handler'

function truncateAddress(address: string){
	return address.slice(0, 6) + '...' + address.slice(-4)
}

export function Address({address, truncated = false}) {
	return (
		<TouchableOpacity>
			<Text style={[text.address]}>{truncated ? truncateAddress(address) : address}</Text>
		</TouchableOpacity>
	)
}
