import * as React from 'react'
import { LayoutAnimation, Platform } from 'react-native'

import { layout, text } from '../styles/styles'

import { FlatList, KeyboardAvoidingView, SectionList, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, Card, CardSection, Container, ListSeparator, Separator, SectionSpacer, Spacer, Text, Image } from '../components/ThemedComponents'
import { Toggle } from '../components/Toggle'
import { WalletStatus } from '../components/WalletStatus'
import { TokenDeposit } from '../components/TokenDeposit'
import { TokenWithdraw } from '../components/TokenWithdraw'

import { tokenBalances } from '../state/tokenBalances'

const sections = [
	{
		title: 'Deposited Assets',
		data: [
			{
				name: 'Celo Gold',
				symbol: 'mCELO',
				image: require('../assets/images/celo-icon.png')
			},
			{
				name: 'Celo Dollar',
				symbol: 'mcUSD',
				image: require('../assets/images/cusd-icon.png')
			},
			{
				name: 'Celo Euro',
				symbol: 'mcEUR',
				image: require('../assets/images/ceur-icon.png')
			}
		]
	}
]

const mapping = {
	'mCELO': 'CELO',
	'mcUSD': 'cUSD',
	'mcEUR': 'cEUR'
}

export function MoolaMarketScreen() {
	return (
		<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
			<ScrollView>
				<View style={layout.container}>
					<FlatList
						style={layout.cardWrapper}
						data={sections}
						renderItem={({ item: { title, data } }) => (
							<View key={title}>
								<Text style={text.h2}>{title}</Text>
								<Spacer />
								<Card>
									<FlatList
										data={data}
										style={layout.cardList}
										renderItem={({ item: token, index, separators }) => (
											<Toggle key={token.symbol}
												ToggleComponent={() => (
													<View style={[layout.cardListItem, layout.row]}>
														<Image source={token.image} style={layout.assetIcon} />
														<Spacer />
														<View style={[layout.column, {flex: 1}]}>
															<Text style={text.h3}>{token.name}</Text>
															<Text style={text.caption}>{token.symbol}</Text>
														</View>
														<Spacer />
														<Text style={text.h3}>{tokenBalances[token.symbol].amount}</Text>
													</View>
												)}
												ContentComponent={() => (
													<View style={[layout.cardListItemToggleContent]}>
														<DepositWithdraw
															depositToken={{...token, symbol: mapping[token.symbol]}}
															maxDepositAmount={tokenBalances[mapping[token.symbol]].amount}
															withdrawToken={token}
															maxWithdrawAmount={tokenBalances[token.symbol].amount}
														/>
													</View>
												)}
											/>
										)}
										ItemSeparatorComponent={ListSeparator}
									/>
								</Card>
							</View>
						)}
						ItemSeparatorComponent={SectionSpacer}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

function DepositWithdraw({depositToken, maxDepositAmount, withdrawToken, maxWithdrawAmount}){
	const [mode, setMode] = React.useState('None')

	React.useEffect(() => {
		LayoutAnimation.configureNext({
			duration: 200,
			create: { duration: 100, delay: 100, type: 'easeOut', property: 'scaleXY' },
			update: { duration: 500, type: 'spring', springDamping: 0.6, initialVelocity: 30 },
			delete: { duration: 100, type: 'easeOut', property: 'scaleXY' }
		})
	}, [setMode])

	return mode === 'None' ? (
		<View style={[layout.row, layout.spaceEvenly]}>
			<Button onPress={() => setMode('Deposit')}>Deposit</Button>
			<Button onPress={() => setMode('Withdraw')}>Withdraw</Button>
		</View>
	) : mode === 'Deposit' ? (
		<CardSection>
			<TokenDeposit token={depositToken} maxAmount={maxDepositAmount} />
		</CardSection>
	) : mode === 'Withdraw' ? (
		<CardSection>
			<TokenWithdraw token={withdrawToken} maxAmount={maxWithdrawAmount} />
		</CardSection>
	) : null
}