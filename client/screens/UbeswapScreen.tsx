import * as React from 'react'

import { WebView } from 'react-native-webview'

export function BlockExplorerScreen() {
	const uri =
		`https://app.ubeswap.org`

	return (
		<WebView source={{ uri }} />
	)
}
