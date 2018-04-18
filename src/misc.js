export const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];

export const isString = v => !!v.valueOf && typeof v.valueOf() === 'string';
export const isFunction = v => typeof v === 'function';

export const fromPath = (obj, path) => path.reduce((o, i) => (o === Object(o) ? o[i] : o), obj);

export const getQueryString = (params) => {
  return Object
    .keys(params).filter(k => k)
    .map((k) => {
      if (Array.isArray(params[k])) {
        return params[k]
          .map((val) => val !== undefined ? `${encodeURIComponent(k)}[]=${encodeURIComponent(val)}` : '')
          .join('&')
      }
      return params[k] !== undefined ? `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}` : ''
    })
    .join('&')
}
