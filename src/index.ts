import { FastifyPluginCallback } from 'fastify';
import { parseRoute, removeduplicateRoute } from './parseRoute';
import { parseConfig } from './parseConfig';
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
  /**
   * 运行模式
   */
  mode?: 'development' | 'production';
}

export const mfeProxyServerPlugin: FastifyPluginCallback<options> = function mfeProxyServerPlugin(
  fastify,
  { manifest, context, mode },
  done
) {
  const workDir = typeof context === 'string' ? context : process.cwd();

  if (manifest.applications.length) {
    const set: Set<string> = new Set();

    const Hosts = manifest.applications
      .map((appMeta) =>
        parseConfig(
          workDir,
          removeduplicateRoute(set, parseRoute(workDir, appMeta))
        )
      )
      .map((appMeta) => new HostApp(workDir, mode, fastify, appMeta));

    hostOutputDir(
      fastify,
      Hosts.map((host) => host.outputDir)
    );

    Hosts.forEach((host) => host.host());
  }

  done();
};
