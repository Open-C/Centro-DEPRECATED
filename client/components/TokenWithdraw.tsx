import * as React from 'react'

import { layout } from '../styles/styles'

import { View } from 'react-native'
import { Button, Separator } from './ThemedComponents'
import { TokenAmountSelect } from './TokenAmountSelect'

export function TokenWithdraw({token, maxAmount}) {
	const [amount, setAmount] = React.useState(maxAmount)

	return (
		<View>
			<TokenAmountSelect
				action="Withdraw"
				token={token}
				maxAmount={maxAmount}
				amount={amount} setAmount={setAmount}
			/>
			<Separator />
			<View style={[layout.row, layout.spaceEvenly]}>
				<Button>Withdraw</Button>
			</View>
		</View>
	)
}