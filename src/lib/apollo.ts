import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'https://graphql.anilist.co' });

let apolloClient: ApolloClient<unknown> | null = null;

export function getClient(): ApolloClient<unknown> {
  if (typeof window !== 'undefined' && apolloClient) return apolloClient;

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache({
      typePolicies: {
        // Different queries select different title fields; merge instead of replacing.
        MediaTitle: { merge: true },
        MediaCoverImage: { merge: true },
      },
    }),
  });

  if (typeof window !== 'undefined') apolloClient = client;

  return client;
}