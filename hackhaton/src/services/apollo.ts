import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const ZAPPER_API_KEY = '63397e29-d47e-4d15-81db-1a36ff65975d' // Move this to .env
const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql'

const BITQUERY_API_URL = 'https://graphql.bitquery.io'
const BITQUERY_API_KEY = 'ory_at_wkonAGkYeikhBcm-2XfM7WWHEC7-2gQDR37HyAOMcTM.17kt-5z4km_8STtB5CfQFCsl0yUh7NDBA2ZIpEj9emU'
// Create the http link
const zapperHttpLink = createHttpLink({
  uri: ZAPPER_API_URL,
})

const zapperAuthLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'x-zapper-api-key': ZAPPER_API_KEY,
  }
}))



const bitqueryHttpLink = createHttpLink({
  uri: BITQUERY_API_URL,
})

const bitqueryAuthLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${BITQUERY_API_KEY}`,

  }
}))





// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'bitquery',
    bitqueryAuthLink.concat(bitqueryHttpLink), //if above
    zapperAuthLink.concat(zapperHttpLink)
),
  cache: new InMemoryCache(),
})