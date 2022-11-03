import { useConnect, useAccount } from 'wagmi'
 
function ConnectWallet() {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  
  const connector = connectors[0];
  
  return (
    <div>
      <button 
        disabled={!connector.ready}
        key={connector.id}
        onClick={() => connect({ connector })}
        >
          Connect Wallet
          {
            isLoading &&
            connector.id === pendingConnector?.id &&
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

export default ConnectWallet;
