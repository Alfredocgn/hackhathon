import { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css'

export default function App() {
    const [account, setAccount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [balance, setBalance] = useState(null);

    async function connectWallet() {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        detectNetwork(provider);
    } else {
        alert("MetaMask no está instalado.");
    }
    }

    async function detectNetwork(provider) {
    const network = await provider.getNetwork();
    const networks = {
        324: "zkSync Era",
        137: "Polygon",
        56: "BNB Smart Chain",
    };
    setNetwork(networks[network.chainId] || "Otra Red");
    }

    async function fetchBalance() {
    if (!account || !network) return;
    const response = await fetch(`http://127.0.0.1:8000/balance/${network.toLowerCase()}/${account}`);
    const data = await response.json();
    setBalance(data.balance);
    }

    return (
    <div>
        <h1>🔗 Conectar Wallet</h1>
        <button onClick={connectWallet}>Conectar MetaMask</button>
        {account && <p>Wallet: {account}</p>}
        {network && <p>Red: {network}</p>}
        <button onClick={fetchBalance}>Consultar Saldo</button>
        {balance && <p>Saldo: {balance} ETH</p>}
    </div>
    );
    }
