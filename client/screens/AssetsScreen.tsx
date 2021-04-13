import * as React from 'react'
import { LayoutAnimation, Platform } from 'react-native'

import { layout, text } from '../styles/styles'

import { FlatList, KeyboardAvoidingView, SectionList, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, Card, CardSection, Container, ListSeparator, Separator, SectionSpacer, Spacer, Text, Image } from '../components/ThemedComponents'
import { Toggle } from '../components/Toggle'
import { WalletStatus } from '../components/WalletStatus'
import { TokenRequest } from '../components/TokenRequest'
import { TokenSend } from '../components/TokenSend'

const tokenBalances = {
	'CELO': { amount: 100.00 },
	'cUSD': { amount: 222.22 },
	'cEUR': { amount: 360.98 },
	'mcUSD': { amount: 1000.01 },
	'mcEUR': { amount: 123.45 },
	'cMCO2': { amount: 50 },
}

const sections = [
	{
		title: 'Celo Native Assets',
		data: [
			{
				name: 'Celo Gold',
				symbol: 'CELO',
				image: require('../assets/images/celo-icon.png')
			},
			{
				name: 'Celo Dollar',
				symbol: 'cUSD',
				image: require('../assets/images/cusd-icon.png')
			},
			{
				name: 'Celo Euro',
				symbol: 'cEUR',
				image: require('../assets/images/ceur-icon.png')
			}
		]
	},
	{
		title: 'Other Assets',
		data: [
			{
				name: 'Moola cUSD',
				symbol: 'mcUSD',
				image: require('../assets/images/cusd-icon.png')
			},
			{
				name: 'Moola cEUR',
				symbol: 'mcEUR',
				image: require('../assets/images/ceur-icon.png')
			},
			{
				name: 'Celo Moss Carbon Credit',
				symbol: 'cMCO2',
				image: require('../assets/images/celo-icon.png')
			}
		]
	}
]

const baseAssets = sections[0].data

export function AssetsScreen() {
	return (
		<KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
			<ScrollView>
				<View style={layout.container}>
					<View>
						<Text style={text.h2}>Wallet</Text>
						<Spacer />
						<Card style={layout.centered}>
							<WalletStatus />
						</Card>
					</View>
					<SectionSpacer />
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
														<RequestSend token={token} />
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

	// return (
	// 	<SectionList
	// 		sections={sections}
	// 		keyExtractor={(item, index) => item.symbol}

	// 		renderSectionHeader={({ section: { title } }) => (
	// 			<Text style={text.h2}>{title}</Text>
	// 		)}
	// 		renderItem={({ item, index, separators }) => (
	// 			<TouchableOpacity>
	// 				<View style={[layout.cardListItem, layout.row]}>
	// 					<Image source={item.image} style={{width: 48, height: 48}} />
	// 					<Spacer />
	// 					<View style={[layout.column, {flex: 1}]}>
	// 						<Text style={text.h3}>{item.name}</Text>
	// 						<Text style={text.caption}>{item.symbol}</Text>
	// 					</View>
	// 					<Spacer />
	// 					<Text style={text.strong}>$$$</Text>
	// 				</View>
	// 			</TouchableOpacity>
	// 		)}

	// 		ItemSeparatorComponent={ListSeparator}
	// 		SectionSeparatorComponent={Separator}
	// 	/>
	// )
}

function RequestSend({token}){
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
			<Button onPress={() => setMode('Request')}>Request</Button>
			<Button onPress={() => setMode('Send')}>Send</Button>
		</View>
	) : mode === 'Request' ? (
		<CardSection>
			<TokenRequest token={token} />
		</CardSection>
	) : mode === 'Send' ? (
		<CardSection>
			<TokenSend
				token={token}
				maxAmount={tokenBalances[token.symbol].amount}
			/>
		</CardSection>
	) : null
}