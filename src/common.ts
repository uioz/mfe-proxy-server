import { mfeRoute, mfeConfig } from 'types';

export const MANIFEST_FILE_NAME = 'mfe-manifest.json';

export const DEFAULT_MFE_ROUTE: mfeRoute = {
  domain: [],
};

export const DEFAULT_STATIC_PREFIX = '/static/';

export const DEFAULT_MFE_CONFIG: Required<mfeConfig> = {
  static: {},
};

export const CONFIG_FILE_NAME = 'mfe-config.js';

export const DEFAULT_INDEX_FILE = 'index.html';
