
import './App.css'



import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'



export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? ensName + " (" + address + ")" : address}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
export function WalletOptions() {
  const { connectors, connect } = useConnect()

  console.log(connectors)

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

export function Profile() {
  const { address } = useAccount()
  const { data, error, status } = useEnsName({ address })
  if (status === 'pending') return <div>Loading ENS name</div>
  if (status === 'error')
    return <div>Error fetching ENS name: {error.message}</div>
  return <div>ENS name: {data}</div>
}

export default function App() {
  return (
    <>
    <WalletOptions />
    <Account />
    </>
  )
}