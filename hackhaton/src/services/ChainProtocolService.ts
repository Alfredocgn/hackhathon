import axios from 'axios';

interface Protocol {
    name: string;
    chain: string;
    tvl?: number;
    vaultCount?: number;
}
interface VaultData {
    id: string;
    name: string;

}
interface ProtocolApiResponse {
    name: string;
    chain: string;
    tvl: number;
    vaults: VaultData[];
}
interface ChainStats {
    chainName: string;
    protocolCount: number;
    totalVaults: number;
    protocols: Protocol[];
}

const SUPPORTED_CHAINS = [
    'ethereum',
    'polygon',
    'arbitrum',
    'optimism',
    'avalanche',
    'bsc'
] as const;

export const fetchVaultsFyiData = async (): Promise<Protocol[]> => {
    try {
        const response = await axios.get<ProtocolApiResponse[]>('https://api.vaults.fyi/v1/protocols');
        return response.data.map((protocol: ProtocolApiResponse) => ({
            name: protocol.name,
            chain: protocol.chain,
            tvl: protocol.tvl,
            vaultCount: protocol.vaults?.length || 0
        }));
    } catch (error) {
        console.error('Error fetching data from vaults.fyi:', error);
        return [];
    }
};

const calculateChainStats = (protocols: Protocol[], chain: string): ChainStats => {
    const chainProtocols = protocols.filter(p =>
        p.chain.toLowerCase() === chain.toLowerCase()
    );

    return {
        chainName: chain,
        protocolCount: chainProtocols.length,
        totalVaults: chainProtocols.reduce((sum, p) => sum + (p.vaultCount || 0), 0),
        protocols: chainProtocols
    };
};

export const getChainStats = async (): Promise<ChainStats[]> => {
    const protocols = await fetchVaultsFyiData();
    console.log(protocols);
    return SUPPORTED_CHAINS.map(chain => calculateChainStats(protocols, chain));
};