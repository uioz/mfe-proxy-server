function generateTemplate(env) {
  return `'use strict';
/** @type {import("fastify").FastifyInstance} */
const fastify = require('fastify')({ logger: true });
const { mfeProxyServerPlugin } = require('mfe-proxy-server');

// DO whatever you want before mfeProxyServerPlugin

fastify.register(mfeProxyServerPlugin, {
  mode: ${env.mode ? `'${env.mode}'` : 'process.env.NODE_ENV'},
  manifest: require('./mfe-manifest.json'),
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(${env.port ?? 80}, '${env.host ?? '0.0.0.0'}');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();`;
}

exports.generateTemplate = generateTemplate;
