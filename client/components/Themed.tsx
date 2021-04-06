import * as React from 'react'
import { Text as DefaultText, View } from 'react-native'

import { themes } from '../styles/styles'
import useColorScheme from '../hooks/useColorScheme'

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof themes.light & keyof typeof themes.dark
) {
	const theme = useColorScheme()
	const colorFromProps = props[theme]

	if (colorFromProps) {
		return colorFromProps
	} else {
		return themes[theme][colorName]
	}
}

type ThemeProps = {
	lightColor?: string
	darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & View['props']

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

	return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function Container(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background')

	return <View style={[{ backgroundColor }, style]} {...otherProps} />
}

export function Separator(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
