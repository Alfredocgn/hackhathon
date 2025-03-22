import { FungibleTokenData, TokenInfoProps } from "../graphql/types";
import { FUNGIBLE_TOKEN_QUERY } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';  


export function TokenInfo({tokenInfo}:TokenInfoProps){

    console.log(tokenInfo?.node.network.name)
    const networkMapping: Record<string, string> = {
        "BNB Chain": "BINANCE_SMART_CHAIN_MAINNET",
        "Ethereum": "ETHEREUM_MAINNET",
        "Polygon": "POLYGON_MAINNET",
        "Avalanche": "AVALANCHE_MAINNET",
        "Arbitrum": "ARBITRUM_MAINNET",
        "Optimism": "OPTIMISM_MAINNET",
        "Base": "BASE_MAINNET"
    };
  
    const network = networkMapping[tokenInfo?.node.network.name];


    

    const {data, loading:tokenLoading} = useQuery<FungibleTokenData>(
        FUNGIBLE_TOKEN_QUERY, 
        {
            context:{
                clientName:"zapper"
            },
            variables:{
                "address": tokenInfo?.node.tokenAddress,
                "network": network,
                "first": 3,
                "currency": "USD",
                "timeFrame": "DAY",
                "timestamp": 1742262500000
            },
        } 
    )
    
    const tokenData = data
    if (tokenLoading) return <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-12 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-24 bg-gray-200 rounded-md"></div>
    </div>;


const prepareChartData = () => {
    if (!tokenData?.fungibleToken?.priceData?.priceTicks) return [];
    
    return tokenData.fungibleToken.priceData.priceTicks.map(tick => ({
        timestamp: new Date(tick.timestamp).toLocaleTimeString(),
        price: tick.close
    }));
};

const chartData = prepareChartData();
console.log(chartData,'this is chart data')
    
return (
    <div className="p-4 bg-white rounded-lg shadow-md">

        {/* Gráfico de precios */}
        {chartData.length > 0 && (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Chart (24h)</h3>
                <div className="h-64 bg-gray-50 p-2 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="timestamp" 
                                tick={{fontSize: 12}}
                                interval={Math.floor(chartData.length / 6)}
                            />
                            <YAxis 
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
                                domain={['dataMin', 'dataMax']}
                                tick={{fontSize: 12}}
                            />
                            <Tooltip 
                                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                                labelFormatter={(label) => `Time: ${label}`}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {tokenData?.fungibleToken && (
            <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-bold mb-4">Token Details</h2>

                {/* Market Data Section */}
                {tokenData?.fungibleToken.priceData && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Market Data</h3>
                        
                        {/* Price Information */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-100 p-3 rounded">
                                <p className="text-gray-600">Current Price</p>
                                <p className="text-xl font-semibold">
                                    ${tokenData?.fungibleToken.priceData.price?.toFixed(2) || 'N/A'}
                                </p>
                            </div>
                            <div className="bg-gray-100 p-3 rounded">
                                <p className="text-gray-600">24h Change</p>
                                <p className={`text-xl font-semibold ${
                                    tokenData?.fungibleToken.priceData.priceChange24h && tokenData?.fungibleToken.priceData.priceChange24h > 0
                                        ? 'text-green-500'
                                        : tokenData?.fungibleToken.priceData.priceChange24h && tokenData?.fungibleToken.priceData.priceChange24h < 0
                                        ? 'text-red-500'
                                        : 'text-gray-500'
                                }`}>
                                    {tokenData?.fungibleToken.priceData.priceChange24h?.toFixed(2) || '0.00'}%
                                </p>
                            </div>
                        </div>
                        
                        {/* Additional Market Data */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {tokenData?.fungibleToken.priceData.volume24h && (
                                <div className="bg-gray-100 p-3 rounded">
                                    <p className="text-gray-600 text-sm">24h Volume</p>
                                    <p className="font-medium">${Number(tokenData.fungibleToken.priceData.volume24h).toLocaleString()}</p>
                                </div>
                            )}
                            
                            {tokenData?.fungibleToken.priceData.totalLiquidity && (
                                <div className="bg-gray-100 p-3 rounded">
                                    <p className="text-gray-600 text-sm">Total Liquidity</p>
                                    <p className="font-medium">${Number(tokenData?.fungibleToken.priceData.totalLiquidity).toLocaleString()}</p>
                                </div>
                            )}
                            
                            {tokenData?.fungibleToken.priceData.totalGasTokenLiquidity && (
                                <div className="bg-gray-100 p-3 rounded">
                                    <p className="text-gray-600 text-sm">Gas Token Liquidity</p>
                                    <p className="font-medium">${Number(tokenData?.fungibleToken.priceData.totalGasTokenLiquidity).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Top Holders Section */}
                {tokenData?.fungibleToken.holders && tokenData?.fungibleToken.holders.edges.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Top Holders</h3>
                        <div className="bg-gray-100 rounded overflow-hidden">
                            {tokenData?.fungibleToken?.holders?.edges.map((edge, index) => (
                                <div key={index} className={`p-3 border-b border-gray-200`}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 text-blue-800 p-1 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {edge.node.account?.displayName?.value || 
                                                    edge.node.account?.farcasterProfile?.username || 
                                                    `${edge.node.holderAddress.substring(0, 6)}...${edge.node.holderAddress.substring(edge.node.holderAddress.length - 4)}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{(edge.node.percentileShare * 100).toFixed(2)}%</p>
                                            <p className="text-xs text-gray-500">${Number(edge.node.value).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
);
}