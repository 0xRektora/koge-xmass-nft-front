import { Connectors } from 'web3-react'
const { InjectedConnector, NetworkOnlyConnector } = Connectors

const MetaMask = new InjectedConnector({ supportedNetworks: [137] })

const Infura = new NetworkOnlyConnector({
  providerURL: 'https://polygon-rpc.com/',
})

export const connectors = { MetaMask, Infura }
