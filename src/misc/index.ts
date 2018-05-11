import { OmnicConfig } from '../types';
import { isObject } from './checks';

export const urlRegex = /(?:\w*:\/)?\/.*/gm;

export const keysOf = Object.getOwnPropertyNames as <T>(o: T) => (keyof T)[];

export function getQueryString(params): string {
  const toUri = k => val => val !== undefined ? `${encodeURIComponent(k)}=${encodeURIComponent(val)}` : '';

  return Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map(toUri(k))
          .filter(p => p)
          .join('&')
      }

      return toUri(k)(params[k])
    })
    .filter(k => k)
    .join('&')
}

/**
 * Returns a valid fetch config from the omnic's OmnicConfig
 *
 * @export
 * @param { OmnicConfig } config
 * @returns { RequestInit }
 */
export function prepareFetchConfig(config: OmnicConfig): RequestInit {
  const validKeys: ((keyof RequestInit) | 'params')[] = [
    'body',
    'integrity',
    'keepalive',
    'referrer',
    'cache',
    'credentials',
    'headers',
    'mode',
    'redirect',
    'referrerPolicy',
    'method'
  ];

  const fetchConfig: RequestInit = {};

  for (const key of validKeys) {
    fetchConfig[key] = config[key];
  }

  if (isObject(fetchConfig.body)) {
    fetchConfig.body = JSON.stringify(fetchConfig.body);
  }

  return fetchConfig;
}

export * from './checks'
export * from './consts'
export * from './mergeStrategies'
