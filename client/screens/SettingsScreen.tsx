import * as React from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { SettingsStackParamList } from '../navigation/types'

import { layout, text } from '../styles/styles'

import { TouchableOpacity, ScrollView, View } from 'react-native'
import { Button, Card, Spacer, Text } from '../components/ThemedComponents'

export function SettingsScreen({ navigation }: StackScreenProps<SettingsStackParamList, 'SettingsScreen'>) {
	return (
		<ScrollView style={layout.container}>
			<TouchableOpacity onPress={() => navigation.navigate('WalletsScreen')}>
				<Card style={layout.row}>
					<Text style={text.h2}>Manage Wallet</Text>
				</Card>
			</TouchableOpacity>
		</ScrollView>
	)
}
