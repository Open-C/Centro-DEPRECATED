import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Button, Separator, Spacer, Text } from './ThemedComponents'
import TokenAmountSelect from './TokenAmountSelect'
import { TextInput } from 'react-native-gesture-handler'

export default function TokenDeposit({token}) {
	return (
		<View>
			<Text style={text.h3}>Deposit {token.name}</Text>
			<Spacer />
			<View style={[layout.row, layout.centered]}>
				<Button>Done</Button>
			</View>
		</View>
	)
}