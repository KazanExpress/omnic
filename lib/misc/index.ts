export function isString(v): v is string {
  return typeof v === 'string' || (!!v && isFunction(v.valueOf) && typeof v.valueOf() === 'string');
}

export function isObject(v): v is object {
  return Object.prototype.toString.apply(v) === '[object Object]';
}

export function isFunction(v): v is Function {
  return typeof v === 'function';
}

export const keysOf = Object.getOwnPropertyNames;
