import * as React from 'react'

import { layout } from '../styles/styles'

import { View } from 'react-native'
import { Button, Separator } from './ThemedComponents'
import { TokenAmountSelect } from './TokenAmountSelect'
import { RecipientSelect } from './RecipientSelect'

export function TokenSend({token, maxAmount}) {
	// const [token, setToken] = React.useState(_token)
	// const [maxAmount, setMaxAmount] = React.useState(1)
	const [amount, setAmount] = React.useState(maxAmount)
	const [address, setAddress] = React.useState('')

	return (
		<View>
			<TokenAmountSelect
				action="Send"
				token={token}
				maxAmount={maxAmount}
				amount={amount} setAmount={setAmount}
			/>
			<Separator />
			<RecipientSelect address={address} setAddress={setAddress} />
			<Separator />
			<View style={[layout.row, layout.spaceEvenly]}>
				<Button>Send</Button>
			</View>
		</View>
	)
}