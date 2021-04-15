import * as React from 'react'

import { useWallet } from '../state/wallet'

import { layout, text } from '../styles/styles'

import { ActivityIndicator, View } from 'react-native'
import { Button, Image, Spacer, Text } from '../components/ThemedComponents'
import { Address } from '../components/Address'

const wallets = [{
	name: 'Valora',
	icon: require('../assets/images/valora-logo.png')
}]

export function WalletStatus() {
	const [state, send] = useWallet()
	const { address, phoneNumber, walletName, error } = state.context

	const wallet = wallets[walletName]

	return <>
		{state.matches('disconnected') ?
			<>
				<Text style={text.h3}>No wallet connected.</Text>
				<Spacer />
				<View style={layout.centered}>
					{wallets.map(({name, icon}) => (
						<Button icon={name} onPress={() => send('CONNECT', {wallet: name})}>Connect {name}</Button>
					))}
					<Spacer />
					<Button>Create New Wallet</Button>
					<Spacer />
					<Button>Import Account Key</Button>
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
				<View style={layout.row}>
					<Image source={wallet.icon} width={30} height={30} />
					<Spacer />
					<Text style={text.h2}>{walletName}</Text>
				</View>
				<Address address={address} />
				<Text style={text.p}>Phone: {phoneNumber}</Text>
			</>
		: null}
	</>
}
