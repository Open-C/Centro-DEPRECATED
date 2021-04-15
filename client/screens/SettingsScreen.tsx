import * as React from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { SettingsStackParamList } from '../navigation/types'

import { layout, text } from '../styles/styles'

import { Switch, TouchableOpacity, ScrollView, View } from 'react-native'
import { Button, Card, Image, Spacer, Text } from '../components/ThemedComponents'
import { FontAwesome5 } from '@expo/vector-icons'

function Caret(){
	return (
		<Text>
			<FontAwesome5 size={14} name="chevron-right" />
		</Text>
	)
}

export function SettingsScreen({ navigation }: StackScreenProps<SettingsStackParamList, 'SettingsScreen'>) {
	return (
		<ScrollView style={layout.container}>
			<TouchableOpacity onPress={() => navigation.navigate('WalletsScreen')}>
				<Card style={[layout.row, layout.spaceBetween]}>
					<Text style={text.h2}>Manage Wallet</Text>
					<View style={layout.row}>
						<Image source={require('../assets/images/accountkey-icon.png')} style={{width: 60, height: 60}} />
						<Spacer />
						<Caret />
					</View>
				</Card>
			</TouchableOpacity>
			<Spacer />
			<View>
				<Card style={[layout.row, layout.spaceBetween]}>
					<Text style={text.h3}>Require PIN on Unlock</Text>
					<Switch />
				</Card>
			</View>
			<Spacer />
			<TouchableOpacity onPress={() => {}}>
				<Card style={[layout.row, layout.spaceBetween]}>
					<Text style={text.h3}>FAQ/Help</Text>
					<Spacer />
					<Caret />
				</Card>
			</TouchableOpacity>
			<Spacer />
			<TouchableOpacity onPress={() => {}}>
				<Card style={[layout.row, layout.spaceBetween]}>
					<Text style={text.h3}>Contact Support</Text>
					<Spacer />
					<Caret />
				</Card>
			</TouchableOpacity>
		</ScrollView>
	)
}
