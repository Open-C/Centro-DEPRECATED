import * as React from 'react'

import { layout, text, themes } from '../styles/styles'
import useColorScheme from '../hooks/useColorScheme'

import { Text as DefaultText, View, Image as DefaultImage } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

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
	return <View style={[layout.container, layout.column, style]} {...props} />
}

export function Card({ style, lightColor, darkColor, ...props }: ViewProps) {
	return (
		<View style={layout.cardWrapper}>
			<View
				style={[
					{
						backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground'),
						shadowColor: useThemeColor({ light: lightColor, dark: darkColor }, 'cardShadow')
					},
					layout.card,
					style
				]}
				{...props}
			/>
		</View>
	)
}

export function Separator({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[layout.hr, style, { backgroundColor }]} {...props} />
}

export function ListSeparator({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[layout.listSeparator, style, { backgroundColor }]} {...props} />
}

export function Spacer() {
	return <View style={layout.spacer} />
}

export function SectionSpacer() {
	return <View style={layout.sectionSpacer} />
}

export function Image({ style, resizeMode = 'contain', ...props }: ImageProps) {
	return <DefaultImage style={[layout.img, style]} resizeMode={resizeMode} {...props} />
}

export function Button({ style, children, ...props }: TextProps & TouchableOpacity['props']){
	return (
		<TouchableOpacity style={[layout.button]} {...props}>
			<Text style={[style, layout.buttonText]}>{children}</Text>
		</TouchableOpacity>
	)
}
