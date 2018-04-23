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
export function aliasFactory(method, adapter = new RequestAdapter()) {
  /**
   * Final alias function
   *
   * @param { LeafConfig } config
   */
  function alias(config) {
    const finalConfig = { ...config, method };

    const internalAlias = (url, parentConfig) => {
      const finalRequest = (optionalConfig = {}) => {
        const _config = mergeConfigs(parentConfig, finalConfig, optionalConfig);

        return adapter.request(
          _config.path + (url || ''),
          prepareFetchConfig(_config)
        );
      }

      // finalRequest[requestMark] = true;

      return finalRequest;
    }

    internalAlias[aliasMark] = method;

    return internalAlias;
  }

  return alias;
}
