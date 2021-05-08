export interface mfeRoute {
  rewrites?: Array<{
    from: Array<string> | string;
    to: string;
  }>;
  index?: string;
  domain?: Array<string>;
}

export interface appProxyOption {
  /**
   * 需要代理的地址
   */
  url: string;
  /**
   * 静态资源地址, 默认 '/static'
   * 相对 url 的地址
   */
  publicPath?: string;
  /**
   * mfe-route 地址, 默认 'mfe-route.json'
   * 相对于 url 的完整路径
   */
  route?: string;
}

export interface mfeConfig {
  /**
   * 当前项目静态配置
   * 由 mfe-proxy-server 使用
   */
  static?:
    | {
        /**
         * 静态资源路径的前缀, 默认 /static
         */
        publicPath?: string;
        /**
         * 静态资源相对于项目所在的位置, 默认 ./dist
         */
        outputDir?: string;
        /**
         * 静态资源前缀, 默认 true
         */
        staticPrefix?: boolean;
      }
    | false;
}

export interface applicationMeta {
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

export interface manifest {
  // TODO: support in next major version
  env: {
    [key: string]: string;
  };
  applications: Array<applicationMeta>;
}
