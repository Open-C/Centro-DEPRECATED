import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { ButtonSmall, Spacer, Text, TextInput } from './ThemedComponents'
import Clipboard from 'expo-clipboard'
import QRCodeScanner from './QRCodeScanner'

export function RecipientSelect({address, setAddress}) {
	const [isScanning, setIsScanning] = React.useState(false)

	function scanQRCode(){
		setIsScanning(true)
	}
	function cancelScanQRCode(){
		setIsScanning(false)
	}

	async function paste(){
		setAddress(await Clipboard.getStringAsync())
	}

	function onDataScanned(data){
		setAddress(data)
		setIsScanning(false)
	}

	return (
		<>
			<View style={layout.row}>
				<Text style={text.h3}>To</Text>
				<Spacer />
				<TextInput
					autoCompleteType="tel"
					placeholder="Address or Phone Number"
					clearButtonMode="always"
					value={address}
					onChangeText={setAddress}
				/>
			</View>
			<Spacer />
			{!isScanning ? (
				<View style={[layout.row, layout.centered]}>
					<ButtonSmall onPress={scanQRCode}>Scan QR Code</ButtonSmall>
					<Spacer />
					<ButtonSmall onPress={paste}>Paste</ButtonSmall>
				</View>
			) : (
				<View style={layout.centered}>
					<QRCodeScanner onDataScanned={onDataScanned} />
					<Spacer />
					<ButtonSmall onPress={cancelScanQRCode}>Cancel</ButtonSmall>
				</View>
			)}
		</>
	)
}