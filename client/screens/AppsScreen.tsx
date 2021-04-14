import * as React from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { AppsStackParamList } from '../navigation/types'

import { layout, text } from '../styles/styles'

import { ScrollView, View } from 'react-native'
import { Card, Container, Image, Spacer, Text } from '../components/ThemedComponents'
import { TouchableOpacity } from 'react-native-gesture-handler'


const dapps = [{
	image: require('../assets/images/moola-thumbnail.png'),
	name: ['moola', 'market'],
	description: 'earn interest on\ncUSD & cEUR',
	navigationLink: 'MoolaMarketScreen',
	theme: {
		backgroundColor: 'hsl(135, 90%, 90%)',
		color: 'hsl(134, 50%, 48%)'
	}
}, {
	image: require('../assets/images/mento-thumbnail.png'),
	name: ['celo', 'mento'],
	description: 'limit orders for\nthe Celo exchange',
	navigationLink: 'MentoScreen',
	theme: {
		backgroundColor: 'hsl(180, 90%, 90%)',
		color: 'hsl(180, 97%, 39%)'
	}
}, {
	image: require('../assets/images/centropay-thumbnail.png'),
	name: ['centro', 'pay'],
	description: 'send and receive\nmoney on the go',
	navigationLink: 'CentroPayScreen',
	theme: {
		backgroundColor: 'hsl(200, 90%, 90%)',
		color: 'hsl(200, 50%, 50%)'
	}
}, {
	image: require('../assets/images/ubeswap-thumbnail.png'),
	name: ['ube', 'swap'],
	description: 'swap between\nERC-20 tokens',
	navigationLink: 'UbeswapScreen',
	theme: {
		backgroundColor: 'hsl(249, 39%, 93%)',
		color: 'hsl(249, 90%, 70%)'
	}
}, {
	image: require('../assets/images/blockexplorer-thumbnail.png'),
	name: ['block', 'explorer'],
	description: 'view transactions\nand balances',
	navigationLink: 'BlockExplorerScreen',
	theme: {
		backgroundColor: 'hsl(0, 18%, 91%)',
		color: 'hsl(0, 0%, 44%)'
	}
}, {
	image: require('../assets/images/carbonoffset-thumbnail.png'),
	name: ['carbon', 'offset'],
	description: 'go carbon negative\nfor free!',
	navigationLink: 'CarbonOffsetScreen',
	theme: {
		backgroundColor: 'hsl(105, 96%, 90%)',
		color: 'hsl(105, 67%, 45%)'
	}
}, {
	image: require('../assets/images/impactmarket-thumbnail.png'),
	name: ['impact', 'market'],
	description: 'donate directly to\nUBI beneficiaries',
	navigationLink: 'ImpactMarketScreen',
	theme: {
		backgroundColor: 'hsl(222, 96%, 93%)',
		color: 'hsl(222, 80%, 56%)'
	}
}, {
	image: require('../assets/images/pollen-thumbnail.png'),
	name: ['pollen', 'hives'],
	description: 'save and lend with\ntrusted peers',
	navigationLink: 'PollenScreen',
	theme: {
		backgroundColor: 'hsl(50, 96%, 90%)',
		color: 'hsl(52, 77%, 45%)'
	}
}, /*{
	image: '',
	name: ['poof', 'cash'],
	description: 'private & anonymous\ntransactions',
	navigationLink: 'PoofCashScreen'
}*/]


export function AppsScreen({ navigation }: StackScreenProps<AppsStackParamList, 'AppsScreen'>) {
	return (
		<ScrollView>
			<Container>
				<View style={layout.grid}>
					{ dapps.map(({image, name, description, navigationLink, theme}) => (
						<TouchableOpacity key={name.join('')} onPress={() => navigation.navigate(navigationLink as keyof AppsStackParamList)}>
							<Card
								lightColor={theme.backgroundColor}
								style={[layout.gridItem, layout.centered, layout.bordered, layout.shadowed, {borderColor: theme.color, shadowColor: theme.color}]}
							>
								<Image source={image} style={{width: '85%', height: '52%', margin: 7}} />
								<Text style={[{color: theme.color}, text.h3]}>
									<Text style={[{color: theme.color}]}>{name[0]}</Text>
									<Text style={[{color: theme.color, fontWeight: 'normal'}]}>{name[1]}</Text>
								</Text>
								<Text style={[{color: theme.color}, text.caption, text.center]}>
									{description}
								</Text>
							</Card>
						</TouchableOpacity>
					)) }
				</View>
			</Container>
		</ScrollView>
	)
}
