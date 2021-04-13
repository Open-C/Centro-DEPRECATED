import * as React from 'react'

import { layout, text } from '../styles/styles'

import { View } from 'react-native'
import { Button, ButtonSmall, Slider, Spacer, Text, TextInput } from '../components/ThemedComponents'
import { format } from 'url'

export default function TokenAmountSelect({
	availableTokens = undefined,
	token, setToken,
	maxAmount,
	amount, setAmount,
}: {
	token: {},

}) {
	const [isFocused, setIsFocused] = React.useState(false)
	const [textInputValue, setTextInputValue] = React.useState<string>(String(amount))

	React.useEffect(() => {
		const parsedAmount = Math.min(parseFloat(textInputValue), maxAmount)
		if(Number.isFinite(parsedAmount))
			setAmount(parsedAmount)
	}, [textInputValue])

	React.useEffect(() => {
		if(!isFocused)
			setTextInputValue(String(amount))
	}, [amount, isFocused])

	return (
		<View>
			<View style={layout.row}>
				<Text style={[text.h3]}>Send</Text>
				<Spacer />
				<TextInput
					style={[text.number, text.center]}
					keyboardType="numeric"
					clearButtonMode="while-editing"
					// selectTextOnFocus={true}
					// autoFocus={true}
					placeholder="0"
					value={textInputValue}
					onChangeText={value => setTextInputValue(value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				<Spacer />
				<Text style={[text.number]}>{token.symbol}</Text>
			</View>
			<Spacer />
			<View style={[layout.row, layout.spaceBetween]}>
				<ButtonSmall onPress={() => setAmount(0.10 * maxAmount)}>10%</ButtonSmall>
				<ButtonSmall onPress={() => setAmount(0.25 * maxAmount)}>25%</ButtonSmall>
				<ButtonSmall onPress={() => setAmount(0.50 * maxAmount)}>50%</ButtonSmall>
				<ButtonSmall onPress={() => setAmount(0.75 * maxAmount)}>75%</ButtonSmall>
				<ButtonSmall onPress={() => setAmount(1.00 * maxAmount)}>max</ButtonSmall>
			</View>
			<Spacer />
			<Slider value={String(amount)} minimumValue={0} maximumValue={maxAmount} onValueChange={value => setAmount(Number(value))} thumbImage={token.image} />
		</View>
	)
}
