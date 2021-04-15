import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'

// const web3 = new Web3('https://forno.celo.org')
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')

export const kit = newKitFromWeb3(web3)
