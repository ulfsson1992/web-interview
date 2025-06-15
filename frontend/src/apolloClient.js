import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.REACT_APP_GRAPHQL_SERVER,
    }),
    cache: new InMemoryCache(),
});

export default client;