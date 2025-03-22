import { useEffect, useState } from 'react';
import { getChainStats } from '../services/ChainProtocolService';


interface Protocol {
    name: string;
    chain: string;
    tvl?: number;
    vaultCount?: number;
}

interface ChainStats {
    chainName: string;
    protocolCount: number;
    totalVaults: number;
    protocols: Protocol[];
}

const ProtocolItem = ({ protocol }: { protocol: Protocol }) => (
    <li key={protocol.name}>
        {protocol.name} ({protocol.vaultCount} vaults)
        {protocol.tvl && (
            <span> - TVL: ${(protocol.tvl / 1e6).toFixed(2)}M</span>
        )}
    </li>
);

const ChainCard = ({ stat }: { stat: ChainStats }) => (
    <div key={stat.chainName} className="chain-card">
        <h3>{stat.chainName.toUpperCase()}</h3>
        <div className="stats">
            <p>Total Protocols: {stat.protocolCount}</p>
            <p>Total Vaults: {stat.totalVaults}</p>
        </div>
        <div className="protocols">
            <h4>Protocols:</h4>
            <ul>
                {stat.protocols.map((protocol) => (
                    <ProtocolItem key={protocol.name} protocol={protocol} />
                ))}
            </ul>
        </div>
    </div>
);

const useChainStats = () => {
    const [chainStats, setChainStats] = useState<ChainStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats = await getChainStats();
                setChainStats(stats);
                setError(null);
            } catch (err) {
                setError('Failed to fetch chain data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { chainStats, loading, error };
};

export const ChainProtocols = () => {
    const { chainStats, loading, error } = useChainStats();

    if (loading) {
        return <div>Loading chain data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="chain-protocols">
            <h2>Chain Protocol Statistics</h2>
            <div className="stats-grid">
                {chainStats.map((stat) => (
                    <ChainCard key={stat.chainName} stat={stat} />
                ))}
            </div>
        </div>
    );
};