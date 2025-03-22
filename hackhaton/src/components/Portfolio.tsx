import { useAccount } from 'wagmi'
import { useQuery } from '@apollo/client'
import { GET_TOKEN_BALANCES, GET_FULL_PORTFOLIO } from '../graphql/queries'
import { TokenBalancesData, FullPortfolioData } from '../graphql/types'
import { useState } from 'react'
import { TokenInfo } from './TokenInfo'


export function Portfolio() {
  const [selectedToken, setSelectedToken] = useState(null)
  const { address } = useAccount()

  const handleTokenSelect = (tokenEdge) => {
    setSelectedToken(tokenEdge)
  }
  const { data: tokenData, loading: tokenLoading } = useQuery<TokenBalancesData>(
    GET_TOKEN_BALANCES,

    {
      context: {
        clientName: 'zapper'
      },
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
      context: {
        clientName: 'zapper'
      },
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
    <div className="portfolio-container m-4">
    <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>

        {tokenBalances && (
          <div className="section flex flex-col gap-4 mb-6">
            <div className='flex flex-row gap-2 items-center justify-center'>
              <h3 className='text-lg font-bold'>Token Balances</h3>
              <p className='text-lg font-bold'>Total Value: ${tokenBalances.totalBalanceUSD.toFixed(2)}</p>
            </div>
            <div className="token-list flex flex-row flex-wrap gap-4">
              {tokenBalances.byToken.edges.map((tokenEdge) => (
                <div 
                  key={`${tokenEdge.node.network.name}-${tokenEdge.node.tokenAddress}`} 
                  className={`token-item flex flex-col items-center justify-center border-2 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors
                    ${selectedToken && selectedToken?.node?.tokenAddress === tokenEdge.node.tokenAddress ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  onClick={() => handleTokenSelect(tokenEdge)}
                >
                  {tokenEdge.node.imgUrlV2 && <img className='w-10 h-10 mb-2' src={tokenEdge.node.imgUrlV2} alt={tokenEdge.node.symbol} />}
                  <div className="token-info text-center">
                    <h4 className='text-lg font-bold'>{tokenEdge.node.name} ({tokenEdge.node.symbol})</h4>
                    <p>Balance: {parseFloat(tokenEdge.node.balance).toFixed(4)}</p>
                    <p>Value: ${tokenEdge.node.balanceUSD.toFixed(2)}</p>
                    <p>Network: {tokenEdge.node.network.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
            {selectedToken && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Token Details</h3>
          <TokenInfo tokenInfo={selectedToken} />
        </div>
      )}

      {fullPortfolio && (
        <div className="section gap-2 mt-4">
          <h3>Network Breakdown</h3>
          <div className="network-list gap-2">
            {fullPortfolio.tokenBalances.byNetwork.edges.map(({ node }) => (
              <div key={node.network.chainId} className="network-item">
                <h4>Network:{node.network.name}</h4>
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