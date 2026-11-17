// Este micro EXPÕE o componente Cardapio via Module Federation.
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  async headers() {
    return [{ source: '/_next/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'micro_cardapio',
          filename: 'static/chunks/remoteEntry.js',
          exposes: { './Cardapio': './components/Cardapio.js' },
          shared: {},
        })
      );
    }
    return config;
  },
};
