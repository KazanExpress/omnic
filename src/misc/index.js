export const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];

export const isString = v => !!v.valueOf && typeof v.valueOf() === 'string';
export const isFunction = v => typeof v === 'function';

export const fromPath = (obj, path) => path.reduce((o, i) => (o === Object(o) ? o[i] : o), obj);

export const getQueryString = (params) => {
  const toUri = (val) => val !== undefined ? `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}` : '';

  return Object.keys(params)
    .filter(k => k)
    .map((k) => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map(toUri)
          .join('&')
      }

      return toUri(params[k])
    })
    .join('&')
}

/**
 * Returns a valid fetch config from the omnic's LeafConfig
 *
 * @export
 * @param { LeafConfig } config
 * @returns { RequestInit }
 */
export function prepareFetchConfig(config) {
  const { beforeEach, afterEach, path, params, ...fetchConfig } = config;
  return fetchConfig;
}

export * from './mergeStrategies'
