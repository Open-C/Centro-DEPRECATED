import * as React from 'react'

import { LayoutAnimation, TouchableOpacity, View } from 'react-native'

export default function Toggle({ ToggleComponent, ContentComponent, ...props }: {
	ToggleComponent: React.ComponentType<any>,
	ContentComponent: React.ComponentType<any>
} & TouchableOpacity['props']){
	const [expanded, setExpanded] = React.useState(false)

	function onPress(){
		LayoutAnimation.configureNext({
			duration: 200,
			create: { duration: 100, delay: 50, type: 'easeOut', property: 'scaleXY' },
			update: { duration: 500, type: 'spring', springDamping: 0.5, initialVelocity: 30 },
			delete: { duration: 100, type: 'easeOut', property: 'scaleXY' }
		})
		setExpanded(!expanded)
	}

	return (
		<View>
			<TouchableOpacity onPress={onPress} onLongPress={onPress} {...props}>
				<ToggleComponent />
			</TouchableOpacity>
			{expanded && <ContentComponent />}
		</View>
	)
}