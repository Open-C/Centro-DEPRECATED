import * as React from 'react'

import { text, themes } from '../styles/styles'
import useColorScheme from '../hooks/useColorScheme'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabParamList, AppsStackParamList, AssetsStackParamList, SettingsStackParamList } from './types'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import AssetsScreen from '../screens/AssetsScreen'
import AppsScreen from '../screens/AppsScreen'
import MoolaMarketScreen from '../screens/MoolaMarketScreen'
import MentoScreen from '../screens/MentoScreen'
import BlockExplorerScreen from '../screens/BlockExplorerScreen'
import CentroPayScreen from '../screens/CentroPayScreen'
import UbeswapScreen from '../screens/UbeswapScreen'
import PollenScreen from '../screens/PollenScreen'
import PoofCashScreen from '../screens/PoofCashScreen'
import SettingsScreen from '../screens/SettingsScreen'

import { Image, Text } from '../components/ThemedComponents'


// const screenOptions = {
// 	headerStyle: {
// 		height: 100
// 	}
// }
const screenOptions = {
	headerStyle: {
		height: 105
	},
	headerStatusBarHeight: 40
}


// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tabconst AssetsStack = createStackNavigator<AssetsStackParamList>()
const AssetsStack = createStackNavigator<AssetsStackParamList>()

function AssetsStackNavigator() {
	return (
		<AssetsStack.Navigator screenOptions={screenOptions}>
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
		<AppsStack.Navigator screenOptions={screenOptions}>
			<AppsStack.Screen
				name="Apps"
				component={AppsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Centro DeFi Apps</Text>
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
		<SettingsStack.Navigator screenOptions={screenOptions}>
			<SettingsStack.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				options={{
					headerTitle: props => <Text style={text.h1}>Settings</Text>
				}}
			/>
		</SettingsStack.Navigator>
	)
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
	const colorScheme = useColorScheme()

	return (
		<BottomTab.Navigator
			initialRouteName="AppsTab"
			tabBarOptions={{ activeTintColor: themes[colorScheme].tint }}>
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
