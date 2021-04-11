import * as React from 'react'

import { layout, text } from '../styles/styles'

import { FlatList, SectionList, ScrollView, TouchableOpacity, View } from 'react-native'
import { Button, Card, Container, ListSeparator, Separator, SectionSpacer, Spacer, Text, Image } from '../components/ThemedComponents'
import Toggle from '../components/Toggle'
import WalletStatus from '../components/WalletStatus'

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

export default function AssetsScreen() {
	return (
		<ScrollView style={layout.container}>
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
								renderItem={({ item, index, separators }) => (
									<Toggle key={item.symbol}
										ToggleComponent={() => (
											<View style={[layout.cardListItem, layout.row]}>
												<Image source={item.image} style={layout.assetIcon} />
												<Spacer />
												<View style={[layout.column, {flex: 1}]}>
													<Text style={text.h3}>{item.name}</Text>
													<Text style={text.caption}>{item.symbol}</Text>
												</View>
												<Spacer />
												<Text style={text.strong}>0</Text>
											</View>
										)}
										ContentComponent={() => (
											<View style={[layout.cardListItemToggleContent, layout.row]}>
												<Button>Deposit</Button>
												<Button>Withdraw</Button>
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
		</ScrollView>
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
