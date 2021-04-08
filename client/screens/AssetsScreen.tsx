import * as React from 'react'

import { layout, text } from '../styles/styles'

import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native'
import { Card, Container, ListSeparator, Separator, Spacer, Text, Image } from '../components/ThemedComponents'

const baseAssets = [
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
	},
]

export default function AssetsScreen() {
	return (
		<ScrollView>
			<Container>
				{/* <Text style={text.h2}>Wallets</Text>
				<Separator /> */}
				<Text style={text.h2}>Celo Native Assets</Text>
				<Spacer />
				<Card>
					<FlatList
						ItemSeparatorComponent={ListSeparator}
						data={baseAssets}
						style={layout.cardList}
						renderItem={({ item, index, separators }) => (
							<TouchableOpacity>
								<View key="symbol" style={[layout.cardListItem, layout.row]}>
									<Image source={item.image} style={{width: 48, height: 48}} />
									<Spacer />
									<View style={[layout.column, {flex: 1}]}>
										<Text style={text.h3}>{item.name}</Text>
										<Text style={text.caption}>{item.symbol}</Text>
									</View>
									<Spacer />
									<Text style={text.strong}>$$$</Text>
								</View>
							</TouchableOpacity>
						)}
					/>
				</Card>
			</Container>
		</ScrollView>
	)
}
