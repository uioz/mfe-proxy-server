export interface mfeRoute {
  domain: Array<string>;
}

export interface appInfo {
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
  applications: Array<appInfo>;
}
