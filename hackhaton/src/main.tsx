import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { WagmiProvider } from 'wagmi'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import config from './services/config.ts'
import { apolloClient } from './services/apollo.ts'
import { ApolloProvider } from '@apollo/client'
const queryClient = new QueryClient()





createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
