import * as React from 'react'

import { layout, text } from '../styles/styles'

import { ActivityIndicator, ScrollView, View } from 'react-native'
import { Button, Image, Separator, Text } from '../components/ThemedComponents'
import { useCurrentTransaction } from '../state/currentTransaction'
import { Address } from '../components/Address'
import { Spacer } from '../components/ThemedComponents'
import { useMachine } from '@xstate/react'
import { transactionMachine } from '../state/transaction'
import { useNavigation } from '@react-navigation/core'

export function TransactionScreen() {
	const [currentTransaction] = useCurrentTransaction()
	const {transactionName, token, from, to, amount } = currentTransaction

	const navigation = useNavigation()

	const [state, send] = useMachine(transactionMachine.withContext({transactionName, from, to, amount }))

	return (
		<ScrollView>
			<View style={layout.container}>
				<Text style={text.h2}>{transactionName}</Text>
				<View style={layout.row}>
					<Image source={token.icon} />
				</View>
				<Separator />
				{/* <Text style={text.h3}>From</Text>
				<Address address={from} />
				<Text style={text.h3}>To</Text>
				<Address address={to} /> */}
				{state.matches('created') ?
					<View style={[layout.row, layout.spaceEvenly]}>
						<Button onPress={() => send('SIGN')}>Sign</Button>
						<Spacer />
						<Button>Cancel</Button>
					</View>
				: state.matches('signing') ?
					<View style={layout.row}>
						<ActivityIndicator />
						<Spacer />
						<Text style={text.h3}>Signing with Valora...</Text>
					</View>
				: 
					<View style={layout.centered}>
						<Image source={require('../assets/images/check-icon.png')} style={{height: 100}} />
						<Spacer />
						<Text style={text.h3}>Transaction confirmed!</Text>
						<Spacer />
						<View style={[layout.row, layout.spaceEvenly]}>
							<Button onPress={() => navigation.navigate('BlockExplorerScreen')}>View Transaction</Button>
							<Spacer />
							<Button>Back</Button>
						</View>
					</View>
				// state.matches('rejected') ?
				// 	<>
				// 		<Text style={text.h3}>We had trouble signing to your wallet.</Text>
				// 		{/* <Text style={text.p}>{error}</Text> */}
				// 		<Spacer />
				// 		<View style={layout.row}>
				// 			<Button onPress={() => send('RETRY')}>Retry</Button>
				// 			<Spacer />
				// 			<Button onPress={() => send('CANCEL')}>Cancel</Button>
				// 		</View>
				// 	</>
				// : state.matches('pending') ?
				// 	<View style={layout.row}>
				// 		<ActivityIndicator />
				// 		<Spacer />
				// 		<Text style={text.h3}>Waiting for transaction to be confirmed...</Text>
				// 	</View>
				// : state.matches('confirmed') ?
// 					<>
// 						<Image source={require('../assets/images/check-icon.png')} style={{height: 100}} />
// 						<Text style={text.h3}>Transaction confirmed!</Text>
// 						<Button>Back</Button>
// 					</>
//: null }
			}
			</View>
		</ScrollView>
	)
}