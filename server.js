// Based on https://github.com/http-party/node-http-proxy#proxying-websockets

import http from 'http';
import httpProxy from 'http-proxy';

//
// Setup our server to proxy standard HTTP requests
//
const proxy = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 8080,
    },
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
})

const proxyServer = http.createServer((req, res) => {
    proxy.web(req, res);
});

//
// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
//
proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
});

proxyServer.listen(8081, () => console.log('Listening on port 8081'));
