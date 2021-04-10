import { StyleSheet } from 'react-native'


const tintColorLight = '#2f95dc'
const tintColorDark = '#fff'

export const themes = {
	light: {
		text: '#000',
		cardBackground: 'hsla(0, 0%, 100%, 1.0)',
		cardShadow: 'hsla(0, 0%, 50%, 1.0)',
		tint: tintColorLight,
		tabIconDefault: '#ccc',
		tabIconSelected: tintColorLight,
		separator: 'hsla(0, 0%, 0%, 0.1)',
	},
	dark: {
		text: '#fff',
		cardBackground: 'hsla(0, 0%, 10%, 1.0)',
		cardShadow: 'hsla(0, 0%, 50%, 1.0)',
		tint: tintColorDark,
		tabIconDefault: '#ccc',
		tabIconSelected: tintColorDark,
		separator: 'hsla(0, 0%, 100%, 0.1)',
	},
}


export const text = StyleSheet.create({
	h1: {
		fontSize: 24,
		lineHeight: 24 * 1.2,
		fontWeight: 'bold'
	},
	h2: {
		fontSize: 20,
		lineHeight: 20 * 1.5,
		fontWeight: 'bold'
	},
	h3: {
		fontSize: 16,
		lineHeight: 16 * 1.5,
		fontWeight: 'bold'
	},
	p: {
		fontSize: 15,
		lineHeight: 15 * 1.1,
	},
	caption: {
		fontSize: 11,
		lineHeight: 11 * 1.1,
		opacity: 0.8
	},
	strong: {
		fontWeight: 'bold'
	},
	code: {
		fontFamily: 'space-mono'
	},
	center: {
		textAlign: 'center'
	}
})


const containerSpacing = 28
const containerInnerSpacing = 36
const cardSpacing = 16
const listSpacing = 16
const gridGap = 8
const gridItemSize = 140


export const layout = StyleSheet.create({
	column: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	grid: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		margin: -gridGap
	},
	gridItem: {
		width: gridItemSize,
		flexBasis: gridItemSize,
		height: gridItemSize,
		margin: gridGap
	},
	full: {
		flex: 1,
		alignSelf: 'stretch'
	},
	centered: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	img: {
		maxWidth: '100%',
		maxHeight: '100%'
	},
	hr: {
		marginVertical: 20,
		height: 1,
		width: '100%',
	},
	spacer: {
		width: 0,
		height: 0,
		margin: 6
	},
	sectionSpacer: {
		margin: containerInnerSpacing / 2
	},
	card: {
		borderRadius: cardSpacing,
		padding: cardSpacing,
		maxWidth: '100%'
	},
	cardList: {
		margin: -cardSpacing,
	},
	listItem: {
		paddingVertical: listSpacing
	},
	listSeparator: {
		height: 1,
		marginHorizontal: listSpacing
	},
	cardListItem: {
		padding: cardSpacing
	},
	cardListItemToggleContent: {
		padding: cardSpacing,
		paddingTop: 0,
		justifyContent: 'space-evenly'
	},
	container: {
		padding: containerSpacing
	},
	bordered: {
		borderWidth: 2,
		borderColor: 'rgba(0, 0, 0, 0.1)'
	},
	shadowed: {
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 3,
		shadowOpacity: 0.25,
		elevation: 3
	},
	assetIcon: {
		width: 45,
		height: 45
	},
	button: {
		borderRadius: 8,
		backgroundColor: 'hsla(190, 40%, 90%, 1.0)',
		paddingVertical: 10,
		paddingHorizontal: 20,
	},
	buttonText: {
		fontWeight: '600',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
		opacity: 0.6
	}
})
