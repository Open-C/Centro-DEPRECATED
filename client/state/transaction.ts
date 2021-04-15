import { Machine, assign } from 'xstate'

import * as Linking from 'expo-linking'
import { FeeCurrency, requestTxSig, waitForSignedTxs } from '@celo/dappkit'
import { kit } from '../state/web3'

const dappName = 'Centro'

const context = {
	transactionObject: undefined,
	feeCurrency: FeeCurrency.cUSD,

	rawTransactions: [],
	error: '',
}

export const transactionMachine = Machine<typeof context, {
	states: {
		created: {},
		signing: {},
		rejected: {},
		pending: {},
		confirmed: {},
		canceled: {}
	}
}>({
	id: 'transaction',

	initial: 'created',

	context,

	states: {
		'created': {
			on: {
				'SIGN': { target: 'signing' }
			},
		},
		'signing': {
			invoke: {
				src: 'sign',
				onDone: {
					actions: 'signingDone',
					target: 'pending'
				},
				onError: {
					target: 'rejected',
					actions: assign({ error: (context, event) => event.data })
				}
			},
			on: {
				'REJECT': { target: 'rejected' }
			}
		},
		'rejected': {
			on: {
				'RETRY': { target: 'signing' },
				'CANCEL': { target: 'canceled' }
			},
		},
		'pending': {
			on: { 'CONFIRMED': 'confirmed' }
		},
		'confirmed': {
			type: 'final'
		},
		'canceled': {
			type: 'final'
		}
	},
}, {
	actions: {
		'signingDone': assign((context, event) => ({
			rawTransactions: event.data.rawTxs
		}))
	},
	services: {
		'sign': async (context, event) => {
			const {transactionObject} = context
			const {from, to, feeCurrency, transactionName} = event.data

			// const stableToken = await kit.contracts.getStableToken();
			// const decimals = await stableToken.decimals();
			// // This can be a specific account address, a contract address, etc.
			// const transferTo = '<TRANSFER_TO_ACCOUNT>'
			// const transferValue = new BigNumber('10e18');
			// const txObject = stableToken.transfer(
			// transferTo,
			// transferValue.toString()
			// ).txo

			const requestId = transactionName + Math.random()

			requestTxSig(
				kit,
				[{
					tx: transactionObject,
					from,
					to,
					feeCurrency
				}],
				{
					requestId,
					dappName,
					callback: Linking.makeUrl('/')
				}
			)

			waitForSignedTxs(requestId)

			await new Promise(r => setTimeout(r, 2000))
			return {}
		}
	}
})
