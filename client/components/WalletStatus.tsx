import * as React from 'react'

import { useWallet } from '../state/wallet'

import { layout, text } from '../styles/styles'

import { ActivityIndicator, View } from 'react-native'
import { Button, Spacer, Text } from '../components/ThemedComponents'
import { Address } from '../components/Address'

export function WalletStatus() {
	const [state, send] = useWallet()
	const { address, phoneNumber, walletName, error } = state.context

	return <>
		{state.matches('disconnected') ?
			<>
				<Text style={text.h3}>No wallet connected.</Text>
				<Spacer />
				<View style={layout.row}>
					<Button icon={require('../assets/images/valora-logo.png')} onPress={() => send('CONNECT')}>Connect Valora</Button>
				</View>
			</>
		: state.matches('connecting') ?
			<>
				<View style={layout.row}>
					<ActivityIndicator />
					<Spacer />
					<Text style={text.h3}>Connecting to Valora...</Text>
				</View>
				<Spacer />
				<View style={layout.row}>
					<Button onPress={() => send('CANCEL')}>Cancel</Button>
				</View>
			</>
		: state.matches('connectFailed') ?
			<>
				<Text style={text.h3}>We had trouble connecting to your wallet.</Text>
				<Text style={text.p}>{error}</Text>
				<Spacer />
				<View style={layout.row}>
					<Button onPress={() => send('RETRY')}>Retry</Button>
					<Spacer />
					<Button onPress={() => send('CANCEL')}>Cancel</Button>
				</View>
			</>
		: state.matches('connected') ?
			<>
				<Text style={text.h3}>Connected to {walletName}</Text>
				<Address address={address} />
				<Text style={text.p}>Phone: {phoneNumber}</Text>
			</>
		: null}
	</>
}
