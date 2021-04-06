import * as React from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { HomeStackParamList } from '../navigation/types'

import { layout, text } from '../styles/styles'

import { Image, ScrollView, View } from 'react-native'
import { Card, Container, Separator, Text } from '../components/ThemedComponents'
import { TouchableOpacity } from 'react-native-gesture-handler'


const dapps = [{
	image: '',
	name: ['moola', 'market'],
	description: 'earn interest on\ncUSD & cEUR',
	navigationLink: 'MoolaMarketScreen'
}, {
	image: '',
	name: ['celo', 'mento'],
	description: 'limit orders for\nthe Celo exchange',
	navigationLink: 'MentoScreen'
}, {
	image: '',
	name: ['block', 'explorer'],
	description: 'view balances\nand transactions',
	navigationLink: 'BlockExplorerScreen'
}, {
	image: '',
	name: ['ube', 'swap'],
	description: 'swap between\nERC-20 tokens',
	navigationLink: 'UbeswapScreen'
}, {
	image: '',
	name: ['poof', 'cash'],
	description: 'private & anonymous\ntransactions',
	navigationLink: 'PoofCashScreen'
}, {
	image: '',
	name: ['pollen', 'hives'],
	description: 'save and lend\nwith trusted peers',
	navigationLink: 'PollenScreen'
}]


export default function HomeScreen({ navigation }: StackScreenProps<HomeStackParamList, 'HomeScreen'>) {
	return (
		<ScrollView>
			<View style={layout.column}>
				<View style={layout.centered}>
					<Text style={text.h1}>Centro DeFi Wallet</Text>
				</View>
				<Separator />
				<View style={layout.grid}>
					{ dapps.map(({image, name, description, navigationLink}) => (
						<TouchableOpacity onPress={() => navigation.navigate(navigationLink as keyof HomeStackParamList)}>
							<Card style={[layout.gridItem, layout.centered, layout.bordered]}>
								{/* <Image source={image} /> */}
								<Text style={text.h3}>
									<Text style={text.strong}>{name[0]}</Text>
									{name[1]}
								</Text>
								<Text style={text.caption}>
									{description}
								</Text>
							</Card>
						</TouchableOpacity>
					)) }
				</View>
			</View>
		</ScrollView>
	)
}
