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
    this.fastify.register(fastifyStatic, {
      root: this.staticDir,
      wildcard: true,
      prefix: `/static/${this.applicationMeta.name}`,
      decorateReply:
        this.decorateReply && ((this.decorateReply = false) || true),
    });

    return this;
  }

  protected deliverHtml(): HostApp {
    const outputDir = this.outputDir;

    // handle rewrites first
    if (this.applicationMeta.rewrites) {
      for (const { from, to } of this.applicationMeta.rewrites) {
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
      for (const path of this.applicationMeta.domain) {
        const indexFile = this.applicationMeta.index ?? DEFAULT_INDEX_FILE;
        this.fastify.get(path, (request, reply) => {
          reply.sendFile(indexFile, outputDir);
        });
      }
    }

    return this;
  }

  host(decorateReply: boolean): HostApp {
    this.decorateReply = decorateReply;

    // TODO: if staticDir equal to outputDir then stop hosting for staticDir

    return this.hostStaticDir().deliverHtml();
  }
}
