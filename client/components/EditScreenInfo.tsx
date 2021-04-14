import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { text, themes } from '../styles/styles'
import { Text, Container } from './ThemedComponents'

export function EditScreenInfo({ path }: { path: string }) {
	return (
		<Container>
			<Container style={styles.getStartedContainer}>
				<Text
					style={styles.getStartedText}
					lightColor="rgba(0,0,0,0.8)"
					darkColor="rgba(255,255,255,0.8)">
					Open up the code for this screen:
				</Text>

				<Container
					style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
					darkColor="rgba(255,255,255,0.05)"
					lightColor="rgba(0,0,0,0.05)">
					<Text style={text.code}>{path}</Text>
				</Container>

				<Text
					style={styles.getStartedText}
					lightColor="rgba(0,0,0,0.8)"
					darkColor="rgba(255,255,255,0.8)">
					Change any of the text, save the file, and your app will automatically update.
				</Text>
			</Container>

			<Container style={styles.helpContainer}>
				<TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
					<Text style={styles.helpLinkText} lightColor={themes.light.tint}>
						Tap here if your app doesn't automatically update after making changes
					</Text>
				</TouchableOpacity>
			</Container>
		</Container>
	)
}

function handleHelpPress() {
	WebBrowser.openBrowserAsync(
		'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	developmentModeText: {
		marginBottom: 20,
		fontSize: 14,
		lineHeight: 19,
		textAlign: 'center',
	},
	contentContainer: {
		paddingTop: 30,
	},
	welcomeContainer: {
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	welcomeImage: {
		width: 100,
		height: 80,
		resizeMode: 'contain',
		marginTop: 3,
		marginLeft: -10,
	},
	getStartedContainer: {
		alignItems: 'center',
		marginHorizontal: 50,
	},
	homeScreenFilename: {
		marginVertical: 7,
	},
	codeHighlightText: {
		color: 'rgba(96,100,109, 0.8)',
	},
	codeHighlightContainer: {
		borderRadius: 3,
		paddingHorizontal: 4,
	},
	getStartedText: {
		fontSize: 17,
		lineHeight: 24,
		textAlign: 'center',
	},
	helpContainer: {
		marginTop: 15,
		marginHorizontal: 20,
		alignItems: 'center',
	},
	helpLink: {
		paddingVertical: 15,
	},
	helpLinkText: {
		textAlign: 'center',
	},
})