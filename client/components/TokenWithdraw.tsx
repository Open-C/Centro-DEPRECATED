import * as React from 'react'

import { useCurrentTransaction } from '../state/currentTransaction'
import { useNavigation } from '@react-navigation/native'
import { useWallet } from '../state/wallet'

import { layout } from '../styles/styles'

import { View } from 'react-native'
import { Button, Separator } from './ThemedComponents'
import { TokenAmountSelect } from './TokenAmountSelect'

const transactionName = 'Withdraw'
const contractAddress = ''

export function TokenWithdraw({token, maxAmount}) {
	const [amount, setAmount] = React.useState(maxAmount)
	const [transaction, setTransaction] = useCurrentTransaction()

	const [address] = useWallet()

	const navigation = useNavigation()


	function onStartTransaction(){
		setTransaction({
			transactionName,
			token,
			from: address,
			to: contractAddress,
			amount,
			// transactionObject
		})

		navigation.navigate('TransactionScreen')
	}

	return (
		<View>
			<TokenAmountSelect
				action={transactionName}
				token={token}
				maxAmount={maxAmount}
				amount={amount} setAmount={setAmount}
			/>
			<Separator />
			<View style={[layout.row, layout.spaceEvenly]}>
				<Button onPress={onStartTransaction}>{transactionName}</Button>
			</View>
		</View>
	)
}