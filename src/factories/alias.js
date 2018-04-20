import { RequestAdapter } from '../adapters'
import { FetchAdapter } from '../adapters/fetch'

export const aliasMark = '__omnic_method__';

/**
 * Factory function, produces request aliases for different HTTP methods
 *
 * @export
 * @param { Method } method
 * @param { RequestAdapter } [adapter=FetchAdapter]
 * @returns { { (config): Promise, __omnic_method__: Method } }
 */
export function aliasFactory(method, adapter = FetchAdapter) {
  function alias(config) {
    const { path, finalConfig } = { ...config, method };
    return adapter.request(path, finalConfig);
  }

  alias[aliasMark] = method;

  return alias;
}
