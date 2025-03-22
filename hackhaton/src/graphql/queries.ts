import { gql } from '@apollo/client'


//ZAPPER QUERIES
export const GET_TOKEN_BALANCES = gql`
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

export const GET_FULL_PORTFOLIO = gql`
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
export const FUNGIBLE_TOKEN_QUERY = gql`
query($address: Address!, $network: Network!, $timestamp: Timestamp!, $currency: Currency!, $timeFrame: TimeFrame!, $first: Float!)  {
  fungibleToken(address: $address, network: $network) {

    # Basic token information
    address
    symbol
    name
    decimals
    imageUrlV2

    # Market data and pricing information
    priceData {
      marketCap
      price
      priceChange5m
      priceChange1h
      priceChange24h
      volume24h
      totalGasTokenLiquidity
      totalLiquidity

      # Historical price by timestamp 
      historicalPrice(timestamp: $timestamp) {
        price
        timestamp
      }

      # Historical price data for charts
      priceTicks(currency: $currency, timeFrame: $timeFrame) {
        open
        median
        close
        timestamp
      }
    }

    # Token holders information
    holders(first: $first) {
      edges {
        node {
          holderAddress
          percentileShare
          value
          account {
            displayName {
              value
              source
            }
            # Social identity data when available
            farcasterProfile {
              username
              fid
              metadata {
                imageUrl
                warpcast
              }
            }
          }
        }
      }
    }

    # Supply and security information
    totalSupply
    securityRisk {
      reason
    }
  }
}
`


//BITQUERY QUERIES
export const GET_SMART_CONTRACTS = gql`
  query GetSmartContracts($network: String!, $limit: Int = 100) {
    ethereum(network: $network) {
      smartContractCalls(
        options: { limit: $limit }
      ) {
        smartContract {
          address {
            address
          }
          protocolType
          callers: callersCount
          calls: callsCount
        }
        transactions: count
      }
    }
  }
`;