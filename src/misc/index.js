export const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];
export const urlRegex = /(?:\w*:\/)?\/.*/gm;

export const isString = v => typeof v === 'string' || (!!v && isFunction(v.valueOf) && typeof v.valueOf() === 'string');
export const isObject = v => Object.prototype.toString.apply(v) === '[object Object]';
export const isFunction = v => typeof v === 'function';
export const isRequestConfig = v => isObject(v) && isString(v.method) && methods.some(m => m === v.method)
export const routeConfigIsPath = v => isString(v) || (!!v && !isObject(v))

export const isValidPath = p => isString(p) || typeof p === 'number'

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
   * @type { ((keyof RequestInit) | 'params')[] }
   */
  const validKeys = ['body', 'integrity', 'keepalive', 'referrer', 'cache', 'credentials', 'headers', 'mode', 'redirect', 'referrerPolicy', 'method', 'params'];

  /**
   * @type { RequestInit & { params: { [key: string]: string } } }
   */
  const fetchConfig = {};

  for (const key of validKeys) {
    fetchConfig[key] = config[key];
  }

  if (isObject(fetchConfig.body)) {
    fetchConfig.body = JSON.stringify(fetchConfig.body);
  }

  return fetchConfig;
}

export * from './mergeStrategies'
