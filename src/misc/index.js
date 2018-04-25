export const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];
export const urlRegex = /(?:\w*:\/)?\/.*/gm;

export const isString = v => typeof v === 'string' || (!!v && isFunction(v.valueOf) && typeof v.valueOf() === 'string');
export const isObject = v => Object.prototype.toString.apply(v) === '[object Object]';
export const isFunction = v => typeof v === 'function';
export const isConfig = v => isObject(v) && isString(v.method) && methods.some(m => m === v.method)

export const getQueryString = (params) => {
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
export function prepareFetchConfig(config) {
  /**
   * @type { (keyof RequestInit)[] }
   */
  const validKeys = ['body', 'integrity', 'keepalive', 'referrer', 'cache', 'credentials', 'headers', 'mode', 'redirect', 'referrerPolicy', 'method'];

  /**
   * @type { RequestInit }
   */
  const fetchConfig = {};

  for (const key of validKeys) {
    fetchConfig[key] = config[key];
  }

  return fetchConfig;
}

export * from './mergeStrategies'
