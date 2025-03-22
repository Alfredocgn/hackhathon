import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import './App.css'
import { getWalletBalances } from "./services/fetchData";

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider;
  }
}
export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<{ chainId: string; name: string } | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<{ chainId: string; name: string }[]>([]);
  const [balance, setBalance] = useState<any>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);


  
  
  async function connectWallet(): Promise<void> {
    if (window.ethereum) {
      const newProvider = new BrowserProvider(window.ethereum);
      setProvider(newProvider);
      const accounts = await newProvider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await detectNetwork(newProvider);
      await fetchAvailableNetworks();
      localStorage.setItem("connected", "true"); 
    } else {
      alert("MetaMask no está instalado.");
    }
  }

  
  async function detectNetwork(providerInstance?: BrowserProvider): Promise<void> {
    const newProvider = providerInstance || new BrowserProvider(window.ethereum);
    setProvider(newProvider); 
    const net = await newProvider.getNetwork();
    setNetwork({ chainId: `0x${net.chainId.toString(16)}`, name: net.name || "Red Desconocida" });
  }

  
  async function fetchBalance(): Promise<void> {
    if (!account || !network) return;
    const balanceData = await getWalletBalances(network.name.toLowerCase(), account);
    setBalance(balanceData);
  }

  
  async function fetchAvailableNetworks(): Promise<void> {
    try {
      
      const commonNetworks = [
        { chainId: "0x1", name: "Ethereum" },
        { chainId: "0x38", name: "BNB Smart Chain" },
        { chainId: "0x89", name: "Polygon" },
        { chainId: "0x144", name: "zkSync Era" },
        { chainId: "0xa86a", name: "Avalanche" },
        { chainId: "0xfa", name: "Fantom" },
        { chainId: "0xa", name: "Optimism" },
        { chainId: "0xa4b1", name: "Arbitrum" },
        { chainId: "0x5", name: "Goerli" },
        { chainId: "0xaa36a7", name: "Sepolia" }
      ];
      
      // Inicializar lista con las redes comunes
      setAvailableNetworks(commonNetworks);
      
      // Opcionalmente, puedes intentar obtener la red actual y asegurarte de que esté en la lista
      if (network && !commonNetworks.some(net => net.chainId === network.chainId)) {
        setAvailableNetworks(prev => [...prev, network]);
      }
    } catch (error) {
      console.error("Error obteniendo redes disponibles:", error);
    }
  }

  console.log(availableNetworks)

  
  async function switchNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) return alert("MetaMask no está instalado.");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
      await detectNetwork(); 
      fetchBalance();
    } catch (error: any) {
      if (error.code === 4902) {
        // En lugar de mostrar un alert, intentamos añadir la red
        try {
          const networkConfig = getNetworkConfig(chainId);
          if (networkConfig) {
            await addNetwork(networkConfig);
          } else {
            alert("Esta red no está configurada. Agrégala manualmente.");
          }
        } catch (addError) {
          console.error("Error añadiendo la red:", addError);
          alert("Error al añadir la red a MetaMask.");
        }
      } else {
        console.error("Error cambiando de red:", error);
      }
    }
  }
  async function addNetwork(networkParams: any): Promise<void> {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkParams],
      });
      await detectNetwork();
      fetchBalance();
    } catch (error) {
      console.error("Error añadiendo red:", error);
      throw error;
    }
  }
  function getNetworkConfig(chainId: string): any {
    const networkConfigs: Record<string, any> = {
      "0x1": {
        chainId: "0x1",
        chainName: "Ethereum Mainnet",
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_ID"],
        blockExplorerUrls: ["https://etherscan.io"],
      },
      "0x38": {
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
      },
      "0x89": {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com"],
      },
      "0xa86a": {
        chainId: "0xa86a",
        chainName: "Avalanche C-Chain",
        nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io"],
      },
      "0xfa": {
        chainId: "0xfa",
        chainName: "Fantom Opera",
        nativeCurrency: { name: "Fantom", symbol: "FTM", decimals: 18 },
        rpcUrls: ["https://rpc.ftm.tools/"],
        blockExplorerUrls: ["https://ftmscan.com"],
      },
      "0xa": {
        chainId: "0xa",
        chainName: "Optimism",
        nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.optimism.io"],
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
      },
      "0xa4b1": {
        chainId: "0xa4b1",
        chainName: "Arbitrum One",
        nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://arb1.arbitrum.io/rpc"],
        blockExplorerUrls: ["https://arbiscan.io"],
      },
      "0x144": {
        chainId: "0x144",
        chainName: "zkSync Era Mainnet",
        nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://mainnet.era.zksync.io"],
        blockExplorerUrls: ["https://explorer.zksync.io"],
      },
    };
  
    return networkConfigs[chainId];
  }
  
  function chainIdToName(chainId: string): string {
    const networks: Record<string, string> = {
      "0x1": "Ethereum",
      "0x38": "BNB Smart Chain",
      "0x89": "Polygon",
      "0x144": "zkSync Era",
      "0xa86a": "Avalanche",
      "0xfa": "Fantom",
    };
    return networks[chainId] || `Chain ${chainId}`;
  }

  
  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("chainChanged", async () => {
      await detectNetwork(); 
      fetchBalance();
    });

    window.ethereum.on("accountsChanged", async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance();
      } else {
        setAccount(null);
        setBalance(null);
        localStorage.removeItem("connected"); 
      }
    });

    return () => {
      window.ethereum?.removeListener("chainChanged", detectNetwork);
      window.ethereum?.removeListener("accountsChanged", fetchBalance);
    };
  }, []);

  
  useEffect(() => {
    if (localStorage.getItem("connected") === "true") {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (account && network) {
      fetchBalance();
    }
  }, [account, network]);

  return (
    <div>
      <h1>🔗 Conectar Wallet</h1>
      <button onClick={connectWallet}>{account ? "Conectado ✅" : "Conectar MetaMask"}</button>
      {account && <p>Wallet: {account}</p>}
      {network && <p>Red: {network.name}</p>}
      {balance && <pre>{JSON.stringify(balance, null, 2)}</pre>}
  
      <h2>🌐 Redes Disponibles</h2>
      <div className="network-buttons">
        {availableNetworks.length > 0 ? (
          availableNetworks.map((net) => (
            <button
              key={net.chainId}
              onClick={() => switchNetwork(net.chainId)}
              className={network?.chainId === net.chainId ? "active-network" : ""}
            >
              {net.name}
            </button>
          ))
        ) : (
          <p>No se detectaron redes en MetaMask.</p>
        )}
      </div>
      
      <div className="add-network-section">
        <h3>Agregar Redes</h3>
        <p>Haz clic en una red para agregarla a MetaMask si no la tienes configurada:</p>
        <div className="network-buttons">
          {Object.entries(getNetworkConfig("0x1") ? getNetworkConfig : {}).map(([chainId, config]: [string, any]) => (
            <button 
              key={chainId} 
              onClick={() => addNetwork(config)}
              className="add-network-button"
            >
              Agregar {config.chainName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
}
