import React from 'react'

import { Platform, UIManager } from 'react-native'
import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './navigation'
import { StatusBar } from 'expo-status-bar'

if (Platform.OS === 'android') {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

export default function App() {
	const isLoadingComplete = useCachedResources()
	const colorScheme = useColorScheme()

	if (!isLoadingComplete) {
		return null
	} else {
		return (
			<SafeAreaProvider>
				<Navigation colorScheme={colorScheme} />
				<StatusBar />
			</SafeAreaProvider>
		)
	}
}
