import path from 'path';
import fastifyStatic from 'fastify-static';
import { FastifyInstance } from 'fastify';
import { applicationMetaFull } from './parseConfig';
import { DEFAULT_INDEX_FILE, DEFAULT_STATIC_PREFIX } from './common';
import { joinPath, normalizePath } from './utils';
import { mfeRoute } from 'types';

export function hostOutputDir(
  fastify: FastifyInstance,
  root: Array<string>
): void {
  fastify.register(fastifyStatic, {
    root: root,
    wildcard: true,
    decorateReply: true,
  });
}

export class HostApp {
  public staticDir: string;
  public outputDir: string;
  private mfeRoute: mfeRoute | undefined;
  private publicPath: string | undefined;

  constructor(
    workDir: string,
    mode: 'development' | 'production' = 'production',
    private fastify: FastifyInstance,
    private applicationMeta: applicationMetaFull
  ) {
    this.outputDir = path.join(workDir, this.applicationMeta.outputDir);
    this.staticDir = path.join(workDir, this.applicationMeta.staticDir);

    if (mode === 'development') {
      this.mfeRoute = {
        domain: applicationMeta.domain,
        rewrites: applicationMeta.rewrites,
        index: applicationMeta.index,
      };
    }

    // https://github.com/uioz/mfe-proxy-server/issues/21#issue-880421756
    if (this.applicationMeta.config?.static !== false) {
      const publicPathFromConfig = this.applicationMeta.config?.static
        ?.publicPath;

      this.publicPath = normalizePath(
        publicPathFromConfig ?? DEFAULT_STATIC_PREFIX
      );

      const staticPrefixFromConfig = this.applicationMeta.config?.static
        ?.staticPrefix;

      if (
        staticPrefixFromConfig === true ||
        staticPrefixFromConfig === undefined
      ) {
        this.publicPath = joinPath(this.publicPath, this.applicationMeta.name);
      }
    }
  }

  protected hostMfeRoute(): HostApp {
    this.fastify.get(
      `${this.publicPath}${path.parse(this.applicationMeta.routePath).base}`,
      (request, reply) => {
        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(this.mfeRoute);
      }
    );

    return this;
  }

  protected hostStaticDir(): HostApp {
    this.fastify.register(fastifyStatic, {
      root: this.staticDir,
      wildcard: true,
      prefix: this.publicPath,
      decorateReply: false,
    });

    return this;
  }

  protected deliverHtml(): HostApp {
    const { rewrites } = this.applicationMeta;
    const outputDir = this.outputDir;

    // handle rewrites first
    if (rewrites) {
      for (const { from, to } of rewrites) {
        if (Array.isArray(from)) {
          for (const path of from) {
            this.fastify.get(path, (request, reply) => {
              reply.sendFile(to, outputDir);
            });
          }
        } else {
          this.fastify.get(from, (request, reply) => {
            reply.sendFile(to, outputDir);
          });
        }
      }
    }

    if (this.applicationMeta.domain) {
      const { domain, index } = this.applicationMeta;

      for (const path of domain) {
        const indexFile = index ?? DEFAULT_INDEX_FILE;
        this.fastify.get(path, (request, reply) => {
          reply.sendFile(indexFile, outputDir);
        });
      }
    }

    return this;
  }

  host(): HostApp {
    // you need to host mfe-route.json by yourself, if mfe.config.static = false
    // https://github.com/uioz/mfe-proxy-server/issues/13#issuecomment-834174452
    if (this.publicPath && this.mfeRoute) {
      this.hostMfeRoute();
    }

    if (this.publicPath) {
      this.hostStaticDir();
    }

    return this.deliverHtml();
  }
}
