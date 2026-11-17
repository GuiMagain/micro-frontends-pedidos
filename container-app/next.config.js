// O container CONSOME os micros via Module Federation.
const path = require('path');
const NextFederationPlugin = require('@module-federation/nextjs-mf');

const CARDAPIO_URL = process.env.CARDAPIO_URL || 'http://localhost:3001';
const PEDIDO_URL = process.env.PEDIDO_URL || 'http://localhost:3002';

module.exports = {
  webpack(config, options) {
    if (options.isServer) {
      // No servidor os remotes não existem: os imports apontam para um stub vazio.
      const stub = path.resolve(__dirname, 'stubs/RemoteStub.js');
      config.resolve.alias = {
        ...config.resolve.alias,
        'micro_cardapio/Cardapio': stub,
        'micro_pedido/Pedido': stub,
      };
    } else {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'container_app',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            micro_cardapio: `micro_cardapio@${CARDAPIO_URL}/_next/static/chunks/remoteEntry.js`,
            micro_pedido: `micro_pedido@${PEDIDO_URL}/_next/static/chunks/remoteEntry.js`,
          },
          shared: {},
        })
      );
    }
    return config;
  },
};
