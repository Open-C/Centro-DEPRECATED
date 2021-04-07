import * as React from 'react'

import { themes } from '../styles/styles'
import useColorScheme from '../hooks/useColorScheme'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabParamList, HomeStackParamList, AssetsStackParamList, SettingsStackParamList } from './types'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import MoolaMarketScreen from '../screens/MoolaMarketScreen'
import MentoScreen from '../screens/MentoScreen'
import BlockExplorerScreen from '../screens/BlockExplorerScreen'
import CentroPayScreen from '../screens/CentroPayScreen'
import UbeswapScreen from '../screens/UbeswapScreen'
import PollenScreen from '../screens/PollenScreen'
import PoofCashScreen from '../screens/PoofCashScreen'
import AssetsScreen from '../screens/AssetsScreen'
import SettingsScreen from '../screens/SettingsScreen'

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeStackParamList>()

function HomeStackNavigator() {
	return (
		<HomeStack.Navigator>
			<HomeStack.Screen
				name="HomeScreen"
				component={HomeScreen}
				options={{ headerTitle: 'Centro DeFi Wallet' }}
			/>
			<HomeStack.Screen
				name="MoolaMarketScreen"
				component={MoolaMarketScreen}
				options={{ headerTitle: 'MoolaMarket' }}
			/>
			<HomeStack.Screen
				name="MentoScreen"
				component={MentoScreen}
				options={{ headerTitle: 'Mento' }}
			/>
			<HomeStack.Screen
				name="CentroPayScreen"
				component={CentroPayScreen}
				options={{ headerTitle: 'Centro Pay' }}
			/>
			<HomeStack.Screen
				name="UbeswapScreen"
				component={UbeswapScreen}
				options={{ headerTitle: 'Ubeswap' }}
			/>
			<HomeStack.Screen
				name="BlockExplorerScreen"
				component={BlockExplorerScreen}
				options={{ headerTitle: 'Celo Block Explorer' }}
			/>
			<HomeStack.Screen
				name="PollenScreen"
				component={PollenScreen}
				options={{ headerTitle: 'Pollen' }}
			/>
			<HomeStack.Screen
				name="PoofCashScreen"
				component={PoofCashScreen}
				options={{ headerTitle: 'PoofCash' }}
			/>

		</HomeStack.Navigator>
	)
}


const AssetsStack = createStackNavigator<AssetsStackParamList>()

function AssetsStackNavigator() {
	return (
		<AssetsStack.Navigator>
			<AssetsStack.Screen
				name="AssetsScreen"
				component={AssetsScreen}
				options={{ headerTitle: 'Assets' }}
			/>
		</AssetsStack.Navigator>
	)
}


const SettingsStack = createStackNavigator<SettingsStackParamList>()

function SettingsStackNavigator() {
	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				options={{ headerTitle: 'Settings' }}
			/>
		</SettingsStack.Navigator>
	)
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
	const colorScheme = useColorScheme()

	return (
		<BottomTab.Navigator
			initialRouteName="HomeTab"
			tabBarOptions={{ activeTintColor: themes[colorScheme].tint }}>
			<BottomTab.Screen
				name="Home"
				component={HomeStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <Ionicons size={26} name="home-outline" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Assets"
				component={AssetsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <FontAwesome5 size={26} name="coins" color={color} />,
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
