import { useQuery } from '@apollo/client';
import { GET_DEX_TRADES } from '../graphql/queries';
import { useState, useMemo, useCallback } from 'react';

interface DexStats {
  exchangeName: string;
  address: string;
  protocol: string;
  totalTradeAmount: number;
  totalTrades: number;
}

const SUPPORTED_NETWORKS = [
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'bsc', name: 'BSC' },
  { id: 'matic', name: 'Polygon' },
] as const;

type NetworkId = typeof SUPPORTED_NETWORKS[number]['id'];

export const ChainProtocols = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId | null>(null);
  const [timeframe, setTimeframe] = useState(7);

  // Calculate fromDate using useMemo
  const fromDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - timeframe);
    return date.toISOString();
  }, [timeframe]);

  const { loading, error, data } = useQuery(GET_DEX_TRADES, {
    context: { clientName: 'bitquery' },
    variables: {
      network: selectedNetwork,
      limit: 1000,
      from: fromDate
    },
    skip: !selectedNetwork,
    fetchPolicy: 'cache-and-network' // Add this to control caching behavior
  });

  // Process data using useMemo
  const processedData = useMemo(() => {
    if (!data?.ethereum?.dexTrades) return null;

    const dexMap = new Map<string, DexStats>();
    data.ethereum.dexTrades.forEach(trade => {
      const exchangeAddress = trade.exchange.address.address;
      const existing = dexMap.get(exchangeAddress) || {
        exchangeName: trade.exchange.fullName,
        address: exchangeAddress,
        protocol: trade.protocol,
        totalTradeAmount: 0,
        totalTrades: 0
      };

      dexMap.set(exchangeAddress, {
        ...existing,
        totalTradeAmount: existing.totalTradeAmount + (trade.tradeAmount || 0),
        totalTrades: existing.totalTrades + (trade.trades || 0)
      });
    });

    const dexes = Array.from(dexMap.values());
    return {
      dexes,
      totalVolume: dexes.reduce((sum, dex) => sum + dex.totalTradeAmount, 0),
      totalTrades: dexes.reduce((sum, dex) => sum + dex.totalTrades, 0)
    };
  }, [data]);

  // Memoize handlers
  const handleNetworkSelect = useCallback((networkId: NetworkId) => {
    setSelectedNetwork(networkId);
  }, []);

  const handleTimeframeSelect = useCallback((days: number) => {
    setTimeframe(days);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">DEX Activity Explorer</h2>

        {/* Network Selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SUPPORTED_NETWORKS.map((network) => (
            <button
              key={network.id}
              onClick={() => handleNetworkSelect(network.id)}
              className={`px-4 py-2 rounded ${
                selectedNetwork === network.id
                  ? 'bg-blue-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {network.name}
            </button>
          ))}
        </div>

        {/* Timeframe Selection */}
        <div className="flex gap-2 mb-4">
          {[1, 7, 30].map((days) => (
            <button
              key={days}
              onClick={() => handleTimeframeSelect(days)}
              className={`px-4 py-2 rounded ${
                timeframe === days
                  ? 'bg-green-500'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {days} {days === 1 ? 'Day' : 'Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error.message}</div>}

      {processedData && selectedNetwork && (
        <div className="rounded-lg shadow p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">
              {SUPPORTED_NETWORKS.find(n => n.id === selectedNetwork)?.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className=" p-4 rounded">
                <p className="text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold">
                  ${processedData.totalVolume.toLocaleString()}
                </p>
              </div>
              <div className=" p-4 rounded">
                <p className="text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold">
                  {processedData.totalTrades.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Top DEXes</h4>
            <div className="space-y-3">
              {processedData.dexes
                .sort((a, b) => b.totalTradeAmount - a.totalTradeAmount)
                .slice(0, 5)
                .map((dex) => (
                  <div key={dex.address} className=" p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dex.exchangeName}</span>
                      <span className="text-sm ">{dex.protocol}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="">Volume: </span>
                        <span className="font-medium">
                          ${dex.totalTradeAmount.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="">Trades: </span>
                        <span className="font-medium">
                          {dex.totalTrades.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};