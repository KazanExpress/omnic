export const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];

export const isString = v => !!v.valueOf && typeof v.valueOf() === 'string';
export const isFunction = v => typeof v === 'function';

export const fromPath = (obj, path) => path.reduce((o, i) => (o === Object(o) ? o[i] : o), obj);
