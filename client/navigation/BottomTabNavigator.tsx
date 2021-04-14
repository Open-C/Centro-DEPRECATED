import * as React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabParamList, AppsStackParamList, AssetsStackParamList, SettingsStackParamList } from './types'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { AssetsScreen } from '../screens/AssetsScreen'
import { AppsScreen } from '../screens/AppsScreen'
import { MoolaMarketScreen } from '../screens/MoolaMarketScreen'
import { MentoScreen } from '../screens/MentoScreen'
import { BlockExplorerScreen } from '../screens/BlockExplorerScreen'
import { CentroPayScreen } from '../screens/CentroPayScreen'
import { BlockExplorerScreen as UbeswapScreen } from '../screens/UbeswapScreen'
import { CarbonOffsetScreen } from '../screens/CarbonOffsetScreen'
import { ImpactMarketScreen } from '../screens/ImpactMarketScreen'
import { PollenScreen } from '../screens/PollenScreen'
import { PoofCashScreen } from '../screens/PoofCashScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { WalletsScreen } from '../screens/WalletsScreen'

import { Image, Text } from '../components/ThemedComponents'

import { text, themes } from '../styles/styles'
import { useColorScheme } from '../hooks/useColorScheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


// const screenOptions = {
// 	headerStyle: {
// 		height: 100
// 	}
// }
function getScreenOptions(){
	// const colorScheme = useColorScheme()
	// const backgroundColor = themes[colorScheme].screenBackground
	const insets = useSafeAreaInsets()

	// return {
	// 	headerStyle: {
	// 		height: 105,
	// 	},
	// 	headerStatusBarHeight: 40
	// }
	return {
		headerStyle: {
			// backgroundColor,
			height: insets.top + 60,
		},
		headerStatusBarHeight: insets.top * 0.85,
		headerTitleAlign: 'center',
		// cardStyle: { backgroundColor }
	}
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tabconst AssetsStack = createStackNavigator<AssetsStackParamList>()
const AssetsStack = createStackNavigator<AssetsStackParamList>()

function AssetsStackNavigator() {
	return (
		<AssetsStack.Navigator screenOptions={getScreenOptions()}>
			<AssetsStack.Screen
				name="AssetsScreen"
				component={AssetsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Assets</Text>
				}}
			/>
		</AssetsStack.Navigator>
	)
}


const AppsStack = createStackNavigator<AppsStackParamList>()

function AppsStackNavigator() {
	return (
		<AppsStack.Navigator screenOptions={getScreenOptions()}>
			<AppsStack.Screen
				name="Apps"
				component={AppsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Celo DeFi Apps</Text>
				}}
			/>
			<AppsStack.Screen
				name="MoolaMarketScreen"
				component={MoolaMarketScreen}
				options={{
					headerTitle: props => <Image source={require('../assets/images/moola-logo.png')} style={{height: '63%'}} />,
					// headerBackTitle: 'Apps'
				}}
			/>
			<AppsStack.Screen
				name="MentoScreen"
				component={MentoScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Mento</Text>
				}}
			/>
			<AppsStack.Screen
				name="CentroPayScreen"
				component={CentroPayScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Centro Pay</Text>
				}}
			/>
			<AppsStack.Screen
				name="UbeswapScreen"
				component={UbeswapScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Ubeswap</Text>
				}}
			/>
			<AppsStack.Screen
				name="BlockExplorerScreen"
				component={BlockExplorerScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Block Explorer</Text>
				}}
			/>
			<AppsStack.Screen
				name="CarbonOffsetScreen"
				component={CarbonOffsetScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Carbon Offset</Text>
				}}
			/>
			<AppsStack.Screen
				name="ImpactMarketScreen"
				component={ImpactMarketScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>impactMarket</Text>
				}}
			/>
			<AppsStack.Screen
				name="PollenScreen"
				component={PollenScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Pollen</Text>
				}}
			/>
			<AppsStack.Screen
				name="PoofCashScreen"
				component={PoofCashScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>PoofCash</Text>
				}}
			/>
		</AppsStack.Navigator>
	)
}


const SettingsStack = createStackNavigator<SettingsStackParamList>()

function SettingsStackNavigator() {
	return (
		<SettingsStack.Navigator screenOptions={getScreenOptions()}>
			<SettingsStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Settings</Text>
				}}
			/>
			<SettingsStack.Screen
				name="WalletsScreen"
				component={WalletsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Wallets</Text>
				}}
			/>
		</SettingsStack.Navigator>
	)
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export function BottomTabNavigator() {
	// const colorScheme = useColorScheme()
	// const activeTintColor = themes[colorScheme].tint
	// const backgroundColor = themes[colorScheme].menuBackground
	const insets = useSafeAreaInsets()
	const paddingTop = insets.bottom && 4

	return (
		<BottomTab.Navigator
			initialRouteName="Apps"
			tabBarOptions={{
				// activeTintColor,
				// inactiveBackgroundColor: 'transparent',
				// activeBackgroundColor: backgroundColor,
				// style: {height: 82, paddingTop: 4},
				style: {height: insets.bottom + 50 + paddingTop, paddingTop}
			}}>
			<BottomTab.Screen
				name="Assets"
				component={AssetsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <FontAwesome5 size={26} name="coins" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Apps"
				component={AppsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <Ionicons size={26} name="home-outline" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Settings"
				component={SettingsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <Ionicons size={26} name="settings-outline" color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	)
}
