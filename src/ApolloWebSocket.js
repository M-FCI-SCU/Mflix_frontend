import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
    uri: 'http://localhost:5000/graphql',
    headers: {
        authorization: localStorage.getItem("token") || ""
    }
});

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:5000/graphql',
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem("token") || ""
        },
    }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

export default splitLink
