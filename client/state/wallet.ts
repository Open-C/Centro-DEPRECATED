import { Linking } from 'expo'
import { Machine, assign } from 'xstate'

import { requestTxSig, waitForSignedTxs, requestAccountAddress, waitForAccountAuth, FeeCurrency } from '@celo/dappkit'

const dappName = 'Centro'

const walletContext = {
	address: '',
	phoneNumber: '',
	walletName: '',
	error: '',
}

export const walletMachine = Machine<typeof walletContext, {
	states: {
		disconnected: {},
		connecting: {},
		connectFailed: {},
		connected: {}
	}
}>({
	id: 'wallet',

	initial: 'disconnected',

	context: walletContext,

	states: {
		'disconnected': {
			on: {
				'CONNECT': { target: 'connecting' }
			},
		},
		'connecting': {
			invoke: {
				src: 'connect',
				onDone: {
					target: 'connected',
					actions: 'connectDone'
				},
				onError: {
					target: 'connectFailed',
					actions: assign({ error: (context, event) => event.data })
				}
			},
			on: {
				'CANCEL': { target: 'disconnected' }
			}
		},
		'connectFailed': {
			on: {
				'RETRY': { target: 'connecting' },
				'CANCEL': { target: 'disconnected' }
			},
		},
		'connected': {
			on: { 'DISCONNECT': 'disconnected' }
		}
	},
}, {
	actions: {
		'connectDone': assign((context, event) => ({
			address: event.data.address,
			phoneNumber: event.data.phoneNumber,
			walletName: 'Valora'
		}))
	},
	services: {
		'connect': async (context, event) => {
			const requestId = 'login' + Math.random()

			requestAccountAddress({
				requestId,
				dappName,
				callback: Linking.makeUrl('/settings/wallets')
			})

			const { address, phoneNumber } = await waitForAccountAuth(requestId)
			return { address, phoneNumber }
		}
	}
})