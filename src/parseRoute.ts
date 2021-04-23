import path from 'path';
import { applicationMeta, mfeRoute } from 'types';
import { DEFAULT_MFE_ROUTE } from './common';

export interface applicationMetaWithRouteInfo
  extends applicationMeta,
    mfeRoute {}

export function parseRoute(
  workDir: string,
  applicationMeta: applicationMeta
): applicationMetaWithRouteInfo {
  let mfeRoute: mfeRoute;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mfeRoute = require(path.join(
      workDir,
      applicationMeta.routePath
    )) as mfeRoute;
  } catch (error) {
    console.log(`missing ${applicationMeta.routePath}, use empty instead`);
    mfeRoute = DEFAULT_MFE_ROUTE;
  }

  return {
    ...applicationMeta,
    ...mfeRoute,
  };
}

function deduplicate(set: Set<string>, array: Array<string>): Array<string> {
  return array.filter((item) => {
    if (!set.has(item)) {
      set.add(item);
      return true;
    }
    return false;
  });
}

export function removeduplicateRoute(
  set: Set<string>,
  applicationMeta: applicationMetaWithRouteInfo
): applicationMetaWithRouteInfo {
  // handle rewrites first
  if (applicationMeta.rewrites) {
    applicationMeta.rewrites = applicationMeta.rewrites.filter((item) => {
      if (Array.isArray(item.from)) {
        item.from = deduplicate(set, item.from);
        if (item.from.length === 0) {
          return false;
        }
        return true;
      }

      if (!set.has(item.from)) {
        set.add(item.from);
        return true;
      }
      return false;
    });
  }

  if (applicationMeta.domain) {
    applicationMeta.domain = deduplicate(set, applicationMeta.domain);
  }

  return applicationMeta;
}
