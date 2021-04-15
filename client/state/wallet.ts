import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react'
import { useBetween } from 'use-between'

import * as Linking from 'expo-linking'
import { requestTxSig, waitForSignedTxs, requestAccountAddress, waitForAccountAuth, FeeCurrency } from '@celo/dappkit'

const dappName = 'Centro'

const context = {
	address: '',
	phoneNumber: '',
	walletName: '',
	error: '',
}

export const walletMachine = Machine<typeof context, {
	states: {
		disconnected: {},
		connecting: {},
		connectFailed: {},
		connected: {}
	}
}>({
	id: 'wallet',

	initial: 'disconnected',

	context,

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

			// const { address, phoneNumber } = await waitForAccountAuth(requestId)
			// return { address, phoneNumber }

			waitForAccountAuth(requestId)
			await new Promise(r => setTimeout(r, 2000))
			return {
				address: '0x1234567890123456789012345678901234567890',
				phoneNumber: '+1 555-555-5555'
			}
		}
	}
})

const useWalletMachine = () => useMachine(walletMachine)
export const useWallet = () => useBetween(useWalletMachine)