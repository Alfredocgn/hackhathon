import './App.css'
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Portfolio } from './components/Portfolio'
import { ChainProtocols } from './components/ChainProtocols'

export function Account() {
  const { address, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className='flex flex-col gap-4 items-center justify-center'>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div className='text-lg font-bold'>Wallet Address: {ensName ? ensName + " (" + address + ")" : address}</div>}
      <p className='text-lg font-bold'>Chain: {chain?.name}</p>
      <button className=' p-2 rounded-md w-[10rem]' onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <button className=' p-2 rounded-md w-[10rem]'  key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}



export default function App() {
  return (
    <div className='flex flex-col gap-6 items-center justify-center'>
    <WalletOptions />
    <Account />
    <Portfolio />
    <ChainProtocols />
    </div>
  )
}