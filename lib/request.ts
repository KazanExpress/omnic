import { AcceptableConfig, OmnicConfig, OmnicRequestInit, OmnicMethod, MethodCollection } from './types';
import { isString } from './misc';

export function alias<T>(aliasConfig: OmnicConfig) {
  function requestFactory(parentUrl: string, parentConfig: OmnicConfig) {
    return function request(finalConfig?: OmnicConfig): Promise<T> {
      // var config: OmnicConfig; // Merged config
      // Berfore Each here

      return new Promise<T>((resolve, reject) => {
        // config.adapter!.request(url, config).then(result => {
        //   resolve(afterEach(result))
        // }).catch(reject)
      })
    }
  }

  return requestFactory;
}

export function methodAlias<T>(this: any, config?: AcceptableConfig) {
  let pureConfig: OmnicConfig;

  if (isString(config) || typeof config === 'number') {
    pureConfig = { url: String(config), method: this }
  } else {
    pureConfig = config || { method: this };
  }

  return alias<T>(pureConfig);
};

export const methodAliases = [
  'CONNECT', 'DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'
].reduce((collection, method) => {
  collection[method] = methodAlias.bind(method as OmnicMethod);
  return collection;
}, {} as MethodCollection);
