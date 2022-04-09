import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { createUploadLink } from 'apollo-upload-client';

const BACKEND_URL_DEV = "http://localhost:5000/graphql";
const BACKEND_URL_PRODUCTION = "https://apollo-mflix.herokuapp.com/graphql";
const WEBSOCKET_URL_DEV = "ws://localhost:5000/graphql";
const WEBSOCKET_URL_PRODUCTION = "ws://apollo-mflix.herokuapp.com/graphql";


const parseHeaders = (rawHeaders) => {
    const headers = new Headers();
    //That function to convert thing like that to normal syntax
    //"{\"data\":{\"singleUpload\":{\"filename\":\"null\",\"mimetype\":\"null\",\"encoding\":\"null\",\"url\":\"null\",\"__typename\":\"File\"}}}\n"
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach((line) => {
        const parts = line.split(":");
        const key = parts.shift().trim();
        if (key) {
            const value = parts.join(":").trim();
            headers.append(key, value);
        }
    });
    return headers;
};

const uploadFetch = (url, options) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const opts = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            opts.url =
                "responseURL" in xhr
                    ? xhr.responseURL
                    : opts.headers.get("X-Request-URL");
            const body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, opts));
        };
        xhr.onerror = () => {
            reject(new TypeError("Network request failed"));
        };
        xhr.ontimeout = () => {
            reject(new TypeError("Network request failed"));
        };

        // POST https://apollo-mflix.herokuapp.com/graphql
        xhr.open(options.method, url, true);

        Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key]);
        });

        if (xhr.upload) {
            //pass the onprogress of xhr to our onProgress function
            xhr.upload.onprogress = options.onProgress;
        }

        // options.onAbortPossible(() => {
        //     xhr.abort();
        // });
        xhr.send(options.body); //FormData {} => which is the file
    });
const customFetch = (uri, options) => {
    // https://apollo-mflix.herokuapp.com/graphql 
    //===========That our custom option beside option the packages adds
    // {method: 'POST', headers: {…}, useUpload: true, onProgress: ƒ, onAbortPossible: ƒ, …}
    // body: FormData {}
    // headers: {accept: '*/*'}
    // method: "POST"
    // onAbortPossible: abortHandler => {…}
    // onProgress: ev => {…}
    // signal: AbortSignal {aborted: true, onabort: null}
    // useUpload: true}
    if (options.useUpload) {
        return uploadFetch(uri, options);
    }
    return fetch(uri, options);
};

const uploadLink = createUploadLink({
    uri: BACKEND_URL_DEV,
    fetch: customFetch
})
const isFile = value =>
    (typeof File !== "undefined" && value[0] instanceof File) ||
    (typeof Blob !== "undefined" && value[0] instanceof Blob);

const isUpload = ({ variables }) => {
    console.log('variables')
    console.log(Object.values(variables).some(isFile))
    return Object.values(variables).some(isFile);
}
const httpLink = new HttpLink({
    uri: BACKEND_URL_DEV,
    headers: {
        authorization: localStorage.getItem("token") || ""
    }
});

const wsLink = new WebSocketLink({
    uri: WEBSOCKET_URL_DEV,
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
    httpLink);
const terminalLink = split(isUpload, uploadLink, splitLink);

export default terminalLink
