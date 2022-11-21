const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/stock-data', { target: 'http://127.0.0.1:5000', changeOrigin: true }));
    app.use(createProxyMiddleware('/ml/', { target: 'http://127.0.0.1:5001', changeOrigin: true }));
};