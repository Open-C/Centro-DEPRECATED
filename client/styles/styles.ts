import { StyleSheet } from 'react-native'


const tintColorLight = '#2f95dc'
const tintColorDark = '#fff'

export const themes = {
	light: {
		text: '#000',
		background: '#fff',
		tint: tintColorLight,
		tabIconDefault: '#ccc',
		tabIconSelected: tintColorLight,
		separator: '#eee',
	},
	dark: {
		text: '#fff',
		background: '#000',
		tint: tintColorDark,
		tabIconDefault: '#ccc',
		tabIconSelected: tintColorDark,
		separator: 'rgba(255,255,255,0.1)',
	},
}


export const text = StyleSheet.create({
	h1: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	h2: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	p: {
		fontSize: 12
	},
	code: {
		fontFamily: 'space-mono'
	}
})


export const layout = StyleSheet.create({
	column: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	row: {
		display: 'flex',
		flexDirection: 'column',
	},
	grid: {
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap'
	},
	gridItem: {
		flexBasis: 200,
		height: 200
	},
	centered: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	hr: {
		marginVertical: 20,
		height: 1,
		width: '100%',
	},
})
