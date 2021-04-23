import { FastifyPluginCallback } from 'fastify';
import { parseRoute, removeduplicateRoute } from './parseRoute';
import { HostApp, hostOutputDir } from './host';
import { manifest } from './types';

interface options {
  /**
   * 执行上下文 - 绝对路径
   * 默认使用 cwd
   */
  context?: string;
  /**
   * manifest.json 文件
   */
  manifest: manifest;
}

export const mfeProxyServerPlugin: FastifyPluginCallback<options> = function mfeProxyServerPlugin(
  fastify,
  { manifest, context },
  done
) {
  const workDir = typeof context === 'string' ? context : process.cwd();

  if (manifest.applications.length) {
    const set: Set<string> = new Set();

    hostOutputDir(
      fastify,
      manifest.applications
        .map((item) => removeduplicateRoute(set, parseRoute(workDir, item)))
        .map(
          (item, index) =>
            new HostApp(workDir, fastify, item).host(!index).outputDir // !index -> 0 = true, > 0 = false
        )
    );
  }

  done();
};
