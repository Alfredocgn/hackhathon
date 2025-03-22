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
export const GET_DEX_TRADES = gql`
  query GetDexTrades($network: EthereumNetwork!, $limit: Int = 100, $from: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {limit: $limit, desc: "tradeAmount"}
        date: {after: $from}
      ) {
        exchange {
          fullName
          address {
            address
            annotation
          }
        }
        protocol
        tradeAmount(in: USD)
        trades: count
        buyCurrency {
          symbol
          name
        }
        sellCurrency {
          symbol
          name
        }
      }
    }
  }
`;