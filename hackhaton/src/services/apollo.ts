import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const ZAPPER_API_KEY = '63397e29-d47e-4d15-81db-1a36ff65975d' // Move this to .env
const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql'

// Create the http link
const httpLink = createHttpLink({
  uri: ZAPPER_API_URL,
})

// Create the auth link
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-zapper-api-key': ZAPPER_API_KEY,

    }
  }
})

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})