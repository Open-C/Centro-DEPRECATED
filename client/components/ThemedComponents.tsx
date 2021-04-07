import * as React from 'react'
import { Text as DefaultText, View, Image as DefaultImage } from 'react-native'

import { layout, themes } from '../styles/styles'
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
export type ImageProps = ThemeProps & DefaultImage['props']

export function Text({ style, lightColor, darkColor, ...props }: TextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

	return <DefaultText style={[{ color }, style]} {...props} />
}

export function Container({ style, lightColor, darkColor, ...props }: ViewProps) {
	return <View
		style={[
			{
				backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, 'background')
			},
			layout.container,
			style
		]}
		{...props}
	/>
}

export function Card({ style, lightColor, darkColor, ...props }: ViewProps) {
	return <View
		style={[
			{
				backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, 'background')
			},
			layout.card,
			style
		]}
		{...props}
	/>
}

export function Separator({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[layout.hr, style, { backgroundColor }]} {...props} />
}

export function Spacer() {
	return <View style={{ marginTop: 32 }} />
}

export function Image({ style, resizeMode = 'contain', ...props }: ImageProps) {
	return <DefaultImage style={[layout.img, style]} resizeMode={resizeMode} {...props} />
}
