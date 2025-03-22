import { useAccount } from 'wagmi'
import { useQuery } from '@apollo/client'
import { GET_TOKEN_BALANCES, GET_FULL_PORTFOLIO } from '../graphql/queries'
import { TokenBalancesData, FullPortfolioData } from '../services/zapper'


export function Portfolio() {
  const { address } = useAccount()

  const { data: tokenData, loading: tokenLoading } = useQuery<TokenBalancesData>(
    GET_TOKEN_BALANCES,
    {
      variables: {
        addresses: [address],
        first: 10
      },
      skip: !address
    }
  )

  const { data: portfolioData, loading: portfolioLoading } = useQuery<FullPortfolioData>(
    GET_FULL_PORTFOLIO,
    {
      variables: {
        addresses: [address]
      },
      skip: !address
    }
  )

  if (!address) return null
  if (tokenLoading || portfolioLoading) return <div>Loading portfolio...</div>

  const tokenBalances = tokenData?.portfolioV2.tokenBalances
  const fullPortfolio = portfolioData?.portfolioV2

  return (
    <div className="portfolio-container">
      <h2>Portfolio Overview</h2>

      {tokenBalances && (
        <div className="section">
          <h3>Token Balances</h3>
          <p>Total Value: ${tokenBalances.totalBalanceUSD.toFixed(2)}</p>
          <div className="token-list">
            {tokenBalances.byToken.edges.map(({ node }) => (
              <div key={`${node.network.name}-${node.tokenAddress}`} className="token-item">
                {node.imgUrlV2 && <img src={node.imgUrlV2} alt={node.symbol} />}
                <div className="token-info">
                  <h4>{node.name} ({node.symbol})</h4>
                  <p>Balance: {parseFloat(node.balance).toFixed(4)}</p>
                  <p>Value: ${node.balanceUSD.toFixed(2)}</p>
                  <p>Network: {node.network.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {fullPortfolio && (
        <div className="section">
          <h3>Network Breakdown</h3>
          <div className="network-list">
            {fullPortfolio.tokenBalances.byNetwork.edges.map(({ node }) => (
              <div key={node.network.chainId} className="network-item">
                <h4>{node.network.name}</h4>
                <p>Tokens: ${node.balanceUSD.toFixed(2)}</p>
                <p>DeFi: ${
                  fullPortfolio.appBalances.byNetwork.edges.find(
                    (edge) => edge.node.network.chainId === node.network.chainId
                  )?.node.balanceUSD.toFixed(2) || '0.00'
                }</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}