import * as React from 'react'

import { Text, View, StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

import { layout } from '../styles/styles'

export default function QRCodeScanner({ onDataScanned, ...props }) {
	const [hasPermission, setHasPermission] = React.useState<Boolean | null>(null)
	const [scanned, setScanned] = React.useState(false)

	React.useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		})()
	}, [])

	const onBarCodeScanned = ({ type, data }) => {
		if(!scanned){
			setScanned(true)
			onDataScanned(data)
		}
	}

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>
	}

	return (
		// <View style={layout.centered}>
			<BarCodeScanner onBarCodeScanned={onBarCodeScanned} style={{borderRadius: 8, width: 200, height: 200, overflow: 'hidden'}} {...props} />
			// {{scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}}
		// </View>
	)
}