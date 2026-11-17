// Este micro EXPÕE o componente Pedido via Module Federation.
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  async headers() {
    return [{ source: '/_next/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'micro_pedido',
          filename: 'static/chunks/remoteEntry.js',
          exposes: { './Pedido': './components/Pedido.js' },
          shared: {},
        })
      );
    }
    return config;
  },
};
