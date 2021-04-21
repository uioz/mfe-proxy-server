"use strict";
/** @type {import("fastify").FastifyInstance} */
const fastify = require("fastify")();

// DO whatever you want before mfe-server

fastify.register(require("mfe-proxy-server"), {
  manifest: require("./mfe-manifest.json"),
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
