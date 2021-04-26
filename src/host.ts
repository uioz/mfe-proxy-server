import path from 'path';
import fastifyStatic from 'fastify-static';
import { FastifyInstance } from 'fastify';
import { applicationMetaWithRouteInfo } from './parseRoute';
import { DEFAULT_INDEX_FILE } from './common';

export function hostOutputDir(
  fastify: FastifyInstance,
  root: Array<string>
): void {
  fastify.register(fastifyStatic, {
    root: root,
    wildcard: true,
    decorateReply: false,
  });
}

export class HostApp {
  private decorateReply: boolean;
  public staticDir: string;
  public outputDir: string;

  constructor(
    workDir: string,
    private fastify: FastifyInstance,
    private applicationMeta: applicationMetaWithRouteInfo
  ) {
    this.outputDir = path.join(workDir, this.applicationMeta.outputDir);
    this.staticDir = path.join(workDir, this.applicationMeta.staticDir);
    this.decorateReply = false;
  }

  protected hostStaticDir(): HostApp {
    const { publicPath } = this.applicationMeta;
    const staticDir = this.staticDir;
    const outputDir = this.outputDir;

    // https://github.com/uioz/mfe-proxy-server/issues/18#issuecomment-825406189
    if (staticDir !== outputDir) {
      this.fastify.register(fastifyStatic, {
        root: staticDir,
        wildcard: true,
        prefix: publicPath,
        decorateReply:
          this.decorateReply && ((this.decorateReply = false) || true),
      });
    }

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

  host(decorateReply: boolean): HostApp {
    this.decorateReply = decorateReply;

    return this.hostStaticDir().deliverHtml();
  }
}
