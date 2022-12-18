import { useConnect, useAccount } from 'wagmi'
 
export default function ConnectWallet() {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  
  const connector = connectors[0];
  const isConnecting = isLoading && connector.id === pendingConnector?.id;
  
  return (
    <div>
      <button 
        className='btn'
        disabled={!connector.ready || isConnected || isConnecting}
        key={connector.id}
        onClick={() => connect({ connector })}
        >
          Connect Wallet
          {
            isConnecting && 
            ' (connecting)'
          }
          {
            isConnected &&
            ' (connected)'
          }
      </button>
    </div>
  )
}
