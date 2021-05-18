function generateTemplate(env) {
  Object.assign(env, {
    mode: 'process.env.NODE_ENV',
    port: 80,
    host: '0.0.0.0',
  });

  return `'use strict';
  /** @type {import("fastify").FastifyInstance} */
  const fastify = require('fastify')({ logger:true });
  const { mfeProxyServerPlugin } = require('mfe-proxy-server');
  
  // DO whatever you want before mfeProxyServerPlugin
  
  fastify.register(mfeProxyServerPlugin, {
    mode: ${env.mode},
    manifest: require('./mfe-manifest.json'),
  });
  
  // Run the server!
  const start = async () => {
    try {
      await fastify.listen(${env.port},${env.host});
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  start();`;
}

exports.generateTemplate = generateTemplate;
