import {
    ApolloClient,
    InMemoryCache,
    HttpLink
} from "@apollo/client";

const createApolloClient = () =>
    new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            uri: 'https://graphql.anilist.co',
        }),
        cache: new InMemoryCache(),
    });

export default createApolloClient;