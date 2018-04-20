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
  /**
   * Final alias function
   *
   * @param { LeafConfig } config
   */
  function alias(config) {
    const { path, ...finalConfig } = { ...config, method };

    const internalAlias = (url, parentConfig) =>
      (optionalConfig) => adapter.request(
        url + '/' + (path || ''),

        // TODO: Deep merge instead of shallow (for headers)
        { ...parentConfig, ...finalConfig, ...(optionalConfig || {}) }
      );

    internalAlias[aliasMark] = method;

    return internalAlias;
  }

  return alias;
}
