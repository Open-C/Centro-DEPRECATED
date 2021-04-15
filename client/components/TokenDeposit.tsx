import * as React from 'react'

import { layout } from '../styles/styles'

import { View } from 'react-native'
import { Button, Separator } from './ThemedComponents'
import { TokenAmountSelect } from './TokenAmountSelect'

export function TokenDeposit({token, maxAmount}) {
	const [amount, setAmount] = React.useState(maxAmount)

	return (
		<View>
			<TokenAmountSelect
				action="Deposit"
				token={token}
				maxAmount={maxAmount}
				amount={amount} setAmount={setAmount}
			/>
			<Separator />
			<View style={[layout.row, layout.spaceEvenly]}>
				<Button>Deposit</Button>
			</View>
		</View>
	)
}