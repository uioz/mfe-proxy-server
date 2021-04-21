// TODO: use plugincallback type
import * as path from 'path';
import {FastifyInstance, FastifyPluginCallback} from 'fastify';
import fastifyStatic from 'fastify-static';
import {mfeRoute} from './types';
import {DEFAULT_MFE_ROUTE} from './common';
const CWD = process.cwd();

interface appInfo {
  /**
   * 应用程序名称(包名称)
   */
  name: string;
  /**
   * 应用程序所在目录
   */
  dir: string;
  /**
   * 路由配置文件地址
   */
  routePath: string;
  /**
   * 构建后的输出路径
   */
  outputDir: string;
  /**
   * 静态资源路径
   */
  staticDir: string;
}

interface manifest {
  // TODO: support in next major version
  env: {
    [key: string]: string;
  };
  applications: Array<appInfo>;
}

let workDir = '';

function hostStaticDir(
  fastify: FastifyInstance,
  app: appInfo,
  decorateReply = false
): void {
  // HOST static file
  // due to '/static` may included with '/dist`
  // make sure static file match first
  fastify.register(fastifyStatic, {
    root: path.join(workDir, app.staticDir),
    prefix: `/static/${app.name}/`,
    wildcard: false,
    decorateReply,
  });
}

interface appInfoWithRoute extends appInfo {
  route: mfeRoute;
}

function mountRouteToApp(app: appInfo, set: Set<string>): appInfoWithRoute {
  // TODO: support MPA later
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mfeRoute = require(path.join(workDir, app.routePath)) as mfeRoute;

    mfeRoute.domain = mfeRoute.domain.filter((path) => {
      if (set.has(path)) {
        return false;
      }
      set.add(path);
      return true;
    });
    return {
      ...app,
      route: mfeRoute,
    };
  } catch (error) {
    console.log(`missing ${app.routePath}, use empty instead`);
    return {
      ...app,
      route: DEFAULT_MFE_ROUTE,
    };
  }
}

interface options {
  /**
   * 执行上下文 - 绝对路径
   */
  context?: string;
  /**
   * manifest.json 文件
   */
  manifest: manifest;
}

export const mfeProxyServerPlugin: FastifyPluginCallback<options> = function mfeProxyServerPlugin(
  fastify,
  {manifest, context},
  done
) {
  workDir = typeof context === 'string' ? context : CWD;

  const appInfoWithRoute: Array<appInfoWithRoute> = [];

  if (manifest.applications.length) {
    const set: Set<string> = new Set();

    let i = 0;
    const len = manifest.applications.length;

    while (i < len) {
      hostStaticDir(fastify, manifest.applications[i], i === 0);
      const appInfo = mountRouteToApp(manifest.applications[i], set);

      // TODO: MPA support later
      // send entry file
      for (const path of appInfo.route.domain) {
        fastify.get(path, (_request, reply) => {
          reply.sendFile('index.html', appInfo.outputDir);
        });
      }

      appInfoWithRoute.push(appInfo);
      i++;
    }

    // host static files at output dir
    fastify.register(fastifyStatic, {
      root: appInfoWithRoute.map((application) => application.outputDir),
      decorateReply: false,
    });
  }

  done();
};
