import path from 'path';
import { DEFAULT_MFE_CONFIG, CONFIG_FILE_NAME } from './common';
import { applicationMetaWithRouteInfo } from './parseRoute';
import { mfeConfig, applicationMeta } from './types';

export interface applicationMetaFull extends applicationMetaWithRouteInfo {
  config: mfeConfig;
}

export function parseConfig(
  workDir: string,
  applicationMeta: applicationMeta
): applicationMetaFull {
  let mfeConfig: mfeConfig;

  try {
    mfeConfig = require(path.join(
      workDir,
      applicationMeta.dir,
      CONFIG_FILE_NAME
    ));
  } catch (error) {
    mfeConfig = JSON.parse(JSON.stringify(DEFAULT_MFE_CONFIG));
    // TODO: log error in dev
    console.log(
      `${CONFIG_FILE_NAME} not found in ${applicationMeta.name} use empty config instead.`
    );
  }

  return {
    ...applicationMeta,
    config: mfeConfig,
  };
}
