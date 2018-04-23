import { mergeConfigs, prepareFetchConfig, isString } from '../misc'

export const aliasMark = '__omnic_method__';
export const requestMark = '__omnic__';

/**
 * Factory function, produces request aliases for different HTTP methods
 *
 * @export
 * @param { OmnicMethods } method
 * @param { OmnicAdapter } adapter
 * @returns { OmnicMethods }
 */
export function aliasFactory(method, adapter) {

  /**
   * Final alias function
   *
   * @param { OmnicConfig } config
   */
  function alias(config) {
    if (isString(config))
      config = { path: config };

    const finalConfig = { ...config, method };

    const internalAlias = (url, parentConfig) => {
      const finalRequest = (optionalConfig = {}) => {
                                    // Override final route config if the optional config is provided
        const _config = mergeConfigs(parentConfig, optionalConfig || finalConfig);

        return adapter.request(
          _config.path + (url || ''),
          prepareFetchConfig(_config)
        );
      }

      finalRequest[requestMark] = true;

      return finalRequest;
    }

    internalAlias[aliasMark] = method;

    return internalAlias;
  }

  return alias;
}
