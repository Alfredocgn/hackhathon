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