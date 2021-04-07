import * as React from 'react'

import { WebView } from 'react-native-webview'

export default function BlockExplorerScreen({tx, block}: {tx?: string, block?: number}) {
	const uri =
		tx ?
			`https://explorer.celo.org/tx/${tx}`
		: block ?
			`https://explorer.celo.org/blocks/${block}`
		:
			`https://explorer.celo.org`

	return (
		<WebView source={{ uri }} />
	)
}
