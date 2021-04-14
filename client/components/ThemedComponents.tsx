import * as React from 'react'

import { layout, text, themes } from '../styles/styles'
import { useColorScheme } from '../hooks/useColorScheme'

import { Text as DefaultText, View, Image as DefaultImage, TextInput as DefaultTextInput } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Slider as DefaultSlider } from 'react-native-elements'


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
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground')
	const shadowColor = useThemeColor({}, 'cardShadow')

	return (
		<View style={layout.cardWrapper}>
			<View style={[layout.card, { backgroundColor, shadowColor }, style]} {...props} />
		</View>
	)
}

export function CardSection({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardSectionBackground')

	return (
		<View style={layout.cardWrapper}>
			<View style={[layout.cardSection, { backgroundColor }, style]} {...props} />
		</View>
	)
}

export function Separator({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[layout.hr, { backgroundColor }, style]} {...props} />
}

export function ListSeparator({ style, lightColor, darkColor, ...props }: ViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'separator')

	return <View style={[layout.listSeparator, { backgroundColor }, style]} {...props} />
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

export function Button({ style, icon, children, ...props }: TextProps & ThemeProps & TouchableOpacity['props']){
	const backgroundColor = useThemeColor({}, 'buttonBackground')
	const textColor = useThemeColor({}, 'buttonText')

	return (
		<TouchableOpacity style={[layout.button, { backgroundColor }]} {...props}>
			{icon && <Image style={layout.buttonIcon} source={icon} />}
			<Text style={[layout.buttonText, { color: textColor }, style]}>{children}</Text>
		</TouchableOpacity>
	)
}

export function ButtonSmall({ style, icon, children, ...props }: TextProps & TouchableOpacity['props']){
	const backgroundColor = useThemeColor({}, 'buttonBackground')
	const textColor = useThemeColor({}, 'buttonText')

	return (
		<TouchableOpacity style={[layout.button, layout.buttonSmall, { backgroundColor }]} {...props}>
			{icon && <Image style={layout.buttonIcon} source={icon} />}
			<Text style={[layout.buttonText, layout.buttonSmallText, { color: textColor }, style]}>{children}</Text>
		</TouchableOpacity>
	)
}

export function Slider({ style, lightColor, darkColor, tintColor, thumbImage, ...props }: {tintColor: string, thumbImage: string} & ThemeProps & DefaultSlider['props']) {
	const trackColor = useThemeColor({ light: lightColor, dark: darkColor }, 'sliderTrack')
	const trackTintColor = useThemeColor({ light: tintColor, dark: tintColor }, 'sliderTrackTint')

	return (
		<DefaultSlider
			style={[layout.slider, style]}
			minimumTrackTintColor={trackTintColor}
			maximumTrackTintColor={trackColor}
			thumbStyle={[layout.sliderThumb, { backgroundColor: trackColor }]}
			thumbProps={thumbImage && { children: <Image source={thumbImage} style={layout.sliderThumb} /> }}
			{...props}
		/>
	)
}

export function TextInput({ style, lightColor, darkColor, ...props }: ThemeProps & DefaultTextInput['props']) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground')

	return <DefaultTextInput style={[layout.input, { color, backgroundColor }, style]} {...props} />
}