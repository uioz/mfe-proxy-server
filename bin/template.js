'use strict';
/** @type {import("fastify").FastifyInstance} */
const fastify = require('fastify')();
const { mfeProxyServerPlugin } = require('mfe-proxy-server');

// DO whatever you want before mfeProxyServerPlugin

fastify.register(mfeProxyServerPlugin, {
  mode: process.env.NODE_ENV,
  manifest: require('./mfe-manifest.json'),
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
