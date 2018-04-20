import { RequestAdapter } from '../adapters'
import { mergeConfigs, prepareFetchConfig } from '../misc'

export const aliasMark = '__omnic_method__';
export const requestMark = '__omnic__';

/**
 * Factory function, produces request aliases for different HTTP methods
 *
 * @export
 * @param { Method } method
 * @param { RequestAdapter } [adapter=RequestAdapter]
 * @returns { OmnicMethod }
 */
export function aliasFactory(method, rootConfig, adapter = RequestAdapter) {
  /**
   * Final alias function
   *
   * @param { LeafConfig } config
   */
  function alias(config) {
    const { path, ...finalConfig } = { ...config, method };

    const internalAlias = (url, parentConfig) => {
      const finalRequest = (optionalConfig = {}) => adapter.request(
        url + '/' + (path || ''),
        prepareFetchConfig(mergeConfigs(rootConfig, parentConfig, finalConfig, optionalConfig))
      );

      finalRequest[requestMark] = true;
    }

    internalAlias[aliasMark] = method;

    return internalAlias;
  }

  return alias;
}
