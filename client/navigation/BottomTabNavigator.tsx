import * as React from 'react'

import { themes } from '../styles/styles'
import useColorScheme from '../hooks/useColorScheme'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { BottomTabParamList, HomeStackParamList, AssetsStackParamList, SettingsStackParamList } from './types'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
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
					tabBarIcon: ({ color }) => <Ionicons size={30} name="home-outline" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Assets"
				component={AssetsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <FontAwesome5 size={30} name="coins" color={color} />,
				}}
			/>
			<BottomTab.Screen
				name="Settings"
				component={SettingsStackNavigator}
				options={{
					tabBarIcon: ({ color }) => <Ionicons size={30} name="settings-outline" color={color} />,
				}}
			/>
		</BottomTab.Navigator>
	)
}
