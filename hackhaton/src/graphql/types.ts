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
export interface FungibleTokenQueryVariables {
  address: string;
  network: Network;
  timestamp: number;
  currency: Currency;
  timeFrame: TimeFrame;
  first: number;
}
export enum Currency {
  USD = "USD",
  ETH = "ETH",
  BTC = "BTC",
}

export enum TimeFrame {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}
export interface FungibleTokenQueryResponse {
  fungibleToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    imageUrlV2: string;

    priceData: {
      marketCap: number | null;
      price: number | null;
      priceChange5m: number | null;
      priceChange1h: number | null;
      priceChange24h: number | null;
      volume24h: number | null;
      totalGasTokenLiquidity: number | null;
      totalLiquidity: number | null;

      historicalPrice: {
        price: number;
        timestamp: number;
      } | null;

      priceTicks: Array<{
        open: number;
        median: number;
        close: number;
        timestamp: number;
      }> | null;
    } | null;

    holders: {
      edges: Array<{
        node: {
          holderAddress: string;
          percentileShare: number;
          value: number;
          account: {
            displayName: {
              value: string;
              source: string;
            } | null;
            farcasterProfile: {
              username: string;
              fid: number;
              metadata: {
                imageUrl: string;
                warpcast: string;
              } | null;
            } | null;
          } | null;
        };
      }>;
    } | null;

    totalSupply: string | null;
    securityRisk: {
      reason: string;
    } | null;
  } | null;
}

export interface FungibleTokenData {
  fungibleToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    imageUrlV2: string;

    priceData: {
      marketCap: number | null;
      price: number | null;
      priceChange5m: number | null;
      priceChange1h: number | null;
      priceChange24h: number | null;
      volume24h: number | null;
      totalGasTokenLiquidity: number | null;
      totalLiquidity: number | null;

      historicalPrice: {
        price: number;
        timestamp: number;
      } | null;

      priceTicks: Array<{
        open: number;
        median: number;
        close: number;
        timestamp: number;
      }> | null;
    } | null;

    holders: {
      edges: Array<{
        node: {
          holderAddress: string;
          percentileShare: number;
          value: number;
          account: {
            displayName: {
              value: string;
              source: string;
            } | null;
            farcasterProfile: {
              username: string;
              fid: number;
              metadata: {
                imageUrl: string;
                warpcast: string;
              } | null;
            } | null;
          } | null;
        };
      }>;
    } | null;

    totalSupply: string | null;
    securityRisk: {
      reason: string;
    } | null;
  } | null;
}
export type FungibleTokenQuery = {
  query: string;
  variables: FungibleTokenQueryVariables;
};

export interface TokenInfoProps {
  tokenInfo: {
      node: {
          balance: number;
          balanceUSD: number;
          imgUrlV2: string;
          name: string;
          network: {
              name: string;
              __typename: string;
          };
          price: number;
          symbol: string;
          tokenAddress: string;
          __typename: string;
      };
      __typename: string;
  };
}
