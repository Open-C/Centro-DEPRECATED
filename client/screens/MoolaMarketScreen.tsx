import * as React from 'react'

import { layout, text } from '../styles/styles'

import { FlatList, SectionList, ScrollView, TouchableOpacity, View } from 'react-native'
import { Card, Container, ListSeparator, Separator, SectionSpacer, Spacer, Text, Image } from '../components/ThemedComponents'

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

const baseAssets = sections[0].data

export default function MoolaMarketScreen() {
	return (
		<ScrollView>
			<FlatList
				style={layout.container}
				data={sections}
				renderItem={({ item: { title, data } }) => (
					<View key={title}>
						<Text style={text.h2}>{title}</Text>
						<Spacer />
						<Card style={layout.shadowed}>
							<FlatList
								data={data}
								style={layout.cardList}
								renderItem={({ item, index, separators }) => (
									<TouchableOpacity key={item.symbol}>
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
									</TouchableOpacity>
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
}
