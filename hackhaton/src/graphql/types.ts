export interface Network {
  name: string
  slug: string
  chainId: number
}

export interface TokenBalance {
  symbol: string
  tokenAddress: string
  balance: string
  balanceUSD: number
  price: number
  imgUrlV2: string | null
  name: string
  network: {
    name: string
  }
}

export interface NetworkBalance {
  network: Network
  balanceUSD: number
}

export interface TokenBalancesData {
  portfolioV2: {
    tokenBalances: {
      totalBalanceUSD: number
      byToken: {
        totalCount: number
        edges: Array<{
          node: TokenBalance
        }>
      }
    }
  }
}

export interface FullPortfolioData {
  portfolioV2: {
    tokenBalances: {
      totalBalanceUSD: number
      byNetwork: {
        edges: Array<{
          node: NetworkBalance
        }>
      }
    }
    appBalances: {
      totalBalanceUSD: number
      byNetwork: {
        edges: Array<{
          node: NetworkBalance
        }>
      }
    }
  }
}



export interface SmartContractData {
  address: string;
  protocol: string;
  chain: string;
  smartContractCalls: number;
  transactionCount: number;
}

export const SUPPORTED_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bsc', name: 'BSC' },
  { id: 'matic', name: 'Polygon' },
  { id: 'arbitrum', name: 'Arbitrum' },
] as const;