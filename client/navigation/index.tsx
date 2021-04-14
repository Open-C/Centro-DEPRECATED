import * as React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import type { RootStackParamList } from './types'
import { LinkingConfiguration } from './LinkingConfiguration'

import { NavigationContainer } from '@react-navigation/native'
import { BottomTabNavigator } from './BottomTabNavigator'
import { NotFoundScreen } from '../screens/NotFoundScreen'

import type { ColorSchemeName } from 'react-native'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { themes } from '../styles/styles'

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator<RootStackParamList>()

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	const { tint, screenBackground, menuBackground } = themes[colorScheme]

	const CustomDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			primary: tint,
			background: screenBackground,
			card: menuBackground
		}
	}

	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			theme={colorScheme === 'dark' ? CustomDarkTheme : DefaultTheme}>
			<RootStack.Navigator screenOptions={{ headerShown: false }}>
				<RootStack.Screen name="Root" component={BottomTabNavigator} />
				<RootStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
			</RootStack.Navigator>
		</NavigationContainer>
	)
}
