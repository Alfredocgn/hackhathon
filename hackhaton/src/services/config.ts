import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  avalanche,
  fantom,
  zkSync
} from 'wagmi/chains'
import { createClient, http } from 'viem'
import { metaMask } from 'wagmi/connectors'
import { createConfig } from 'wagmi'


const config = createConfig({

  chains: [mainnet,
    polygon,
    optimism,
    arbitrum,
    bsc,
    avalanche,
    fantom,
    zkSync],
    client({ chain }) {
      return createClient({ chain, transport: http() })
    },
    connectors: [

      metaMask(),
    ]

})


export default config;