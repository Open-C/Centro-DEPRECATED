import React from 'react'
import { useBetween } from 'use-between'

const useCurrentTransactionState = () => React.useState({})

export const useCurrentTransaction = () => useBetween(useCurrentTransactionState)