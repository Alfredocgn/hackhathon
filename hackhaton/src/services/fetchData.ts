import axios from "axios";

const API_KEY = "cqt_rQmKtrBK8WCbmkFhbj7BcyvFgt76";

export async function getWalletBalances(chainName: string, walletAddress: string) {
  try {
    const url = `https://api.covalenthq.com/v1/${chainName}/address/${walletAddress}/balances_v2/?key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo balances:", error);
    return null;
  }
}
