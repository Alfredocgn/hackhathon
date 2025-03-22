import { GraphQLClient } from 'graphql-request'

const ZAPPER_API_KEY = 'YOUR_ZAPPER_API_KEY' // You'll need to get this from Zapper
const ZAPPER_API_URL = 'https://api.zapper.xyz/v2/graphql'

// Create GraphQL client
const client = new GraphQLClient(ZAPPER_API_URL, {
  headers: {
    Authorization: `Basic ${ZAPPER_API_KEY}`,
    accept: 'application/json',
  },
})

// Define types for the response
interface TokenBalance {
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

interface PortfolioResponse {
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

// Query to get token balances
const GET_TOKEN_BALANCES = `
  query TokenBalances($addresses: [Address!]!, $first: Int) {
    portfolioV2(addresses: $addresses) {
      tokenBalances {
        totalBalanceUSD
        byToken(first: $first) {
          totalCount
          edges {
            node {
              symbol
              tokenAddress
              balance
              balanceUSD
              price
              imgUrlV2
              name
              network {
                name
              }
            }
          }
        }
      }
    }
  }
`

// Function to fetch token balances
export async function getTokenBalances(address: string, limit: number = 10) {
  try {
    const variables = {
      addresses: [address],
      first: limit,
    }

    const data = await client.request<PortfolioResponse>(
      GET_TOKEN_BALANCES,
      variables
    )
    return data.portfolioV2.tokenBalances
  } catch (error) {
    console.error('Error fetching token balances:', error)
    return null
  }
}

// Query to get portfolio data including apps and NFTs
const GET_FULL_PORTFOLIO = `
  query FullPortfolio($addresses: [Address!]!) {
    portfolioV2(addresses: $addresses) {
      tokenBalances {
        totalBalanceUSD
        byNetwork {
          edges {
            node {
              network {
                name
                slug
                chainId
              }
              balanceUSD
            }
          }
        }
      }
      appBalances {
        totalBalanceUSD
        byNetwork {
          edges {
            node {
              network {
                name
                slug
                chainId
              }
              balanceUSD
            }
          }
        }
      }
    }
  }
`

interface NetworkBalance {
  network: {
    name: string
    slug: string
    chainId: number
  }
  balanceUSD: number
}

interface FullPortfolioResponse {
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

// Function to fetch full portfolio data
export async function getFullPortfolio(address: string) {
  try {
    const variables = {
      addresses: [address],
    }

    const data = await client.request<FullPortfolioResponse>(
      GET_FULL_PORTFOLIO,
      variables
    )
    return data.portfolioV2
  } catch (error) {
    console.error('Error fetching full portfolio:', error)
    return null
  }
}