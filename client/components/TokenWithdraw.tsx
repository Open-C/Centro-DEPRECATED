import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Button, ButtonSmall, Separator, Spacer, Text, TextInput } from './ThemedComponents'
import TokenAmountSelect from './TokenAmountSelect'

export default function TokenWithdraw({token, maxAmount}) {
	// const [token, setToken] = React.useState(_token)
	// const [maxAmount, setMaxAmount] = React.useState(1)
	const [amount, setAmount] = React.useState(maxAmount)

	return (
		<View>
			{/* <Text style={text.h3}>Send</Text>
			<Spacer /> */}
			<TokenAmountSelect
				token={token}
				maxAmount={maxAmount}
				amount={amount} setAmount={setAmount}
			/>
			<Separator />
			<View style={layout.row}>
				<Text style={text.h3}>To</Text>
				<Spacer />
				<TextInput
					autoCompleteType="tel"
					placeholder="Address or Phone Number"
				/>
			</View>
			<Spacer />
			<View style={[layout.row, layout.centered]}>
				<ButtonSmall>Scan QR Code</ButtonSmall>
				<Spacer />
				<ButtonSmall>Paste</ButtonSmall>
			</View>
			<Separator />
			<View style={[layout.row, layout.spaceEvenly]}>
				<Button>Withdraw</Button>
			</View>
		</View>
	)
}