
import './App.css'



import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Portfolio } from './components/Portfolio'



export function Account() {
  const { address, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })



  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? ensName + " (" + address + ")" : address}</div>}
      <p>{chain?.name}</p>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
export function WalletOptions() {
  const { connectors, connect } = useConnect()



  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}



export default function App() {
  return (
    <>
    <WalletOptions />
    <Account />
    <Portfolio />
    </>
  )
}