const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/stock-data', { target: 'https://dzp8d8w0d5.execute-api.us-east-1.amazonaws.com/ct_present', changeOrigin: true }));
    app.use(createProxyMiddleware('/highest-volume', { target: 'https://dzp8d8w0d5.execute-api.us-east-1.amazonaws.com/ct_present', changeOrigin: true }));
    app.use(createProxyMiddleware('/user/', { target: 'https://dzp8d8w0d5.execute-api.us-east-1.amazonaws.com/ct_present', changeOrigin: true }));
    app.use(createProxyMiddleware('/portfolio/', { target: 'https://dzp8d8w0d5.execute-api.us-east-1.amazonaws.com/ct_present', changeOrigin: true }));
    app.use(createProxyMiddleware('/ml/', { target: 'https://dzp8d8w0d5.execute-api.us-east-1.amazonaws.com/ct_present', changeOrigin: true }));
};