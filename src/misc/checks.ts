import { OmnicRoute, OmnicRequest, OmnicRequestConfig, AcceptableConfig, OmnicConfig } from "../types";
import { methods, requestMark, routeMark } from "./consts";

export function isString(v): v is string {
  return typeof v === 'string' || (!!v && isFunction(v.valueOf) && typeof v.valueOf() === 'string');
}

export function isObject(v): v is { [key: string]: any } {
  return Object.prototype.toString.apply(v) === '[object Object]'
}

export function isFunction(v): v is Function {
  return typeof v === 'function';
}

export function isRoute(f): f is OmnicRoute {
  return !!f[routeMark]
}

export function isRequest(f): f is OmnicRequest {
  return !!f[requestMark]
}

export function isRequestConfig(v): v is OmnicRequestConfig {
  return isObject(v) && isString(v.method) && methods.some(m => m === v.method);
}

export function routeConfigIsPath(v: AcceptableConfig): v is Exclude<AcceptableConfig, OmnicConfig> {
  return isString(v) || (!!v && !isObject(v));
}

export function isValidPath(p): p is string | number {
  return isString(p) || typeof p === 'number';
}
