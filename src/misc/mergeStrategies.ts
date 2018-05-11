import { OmnicConfig } from '../types';
import { keysOf } from './';

type Strategy<T = any, C = T, R = C> = (parent: T, child: C) => R;
type ConfigMergeStrategyObject = { [key in keyof OmnicConfig]-?: Strategy };

export function baseMerge<P, C = P, R = C>(
  parent: P | null | undefined,
  child: C | null | undefined,
  strategy: Strategy<P, C, R>,
  defaultValue: P | C | R
): P | C | R {
  const exists = <T>(o: T): o is Exclude<T, null | undefined> => o != undefined;

  if (exists(parent) && exists(child)) {
    return strategy(parent, child)
  } else if (!exists(parent) && exists(child)) {
    return child
  } else if (exists(parent) && !exists(child)) {
    return parent
  } else {
    return defaultValue;
  }
}

export const pipe: Strategy<(...args: any[]) => any> = (parent, child) => baseMerge(parent, child,
  ((p, c) => (...args: any[]) => c(p(...args))) as Strategy<any>,
  (...args) => args
)

export const reversePipe: typeof pipe = (parent, child) => pipe(child, parent)

export const concatURL: Strategy<string> = (p, c) => baseMerge(p, c,
  (parent, child) => new URL(String(child), parent),
  ''
)

export const merge: Strategy = (p, c) => baseMerge<object>(p, c, (parent, child) => {
  //TODO? maybe account for Headers class and string[][]
  return Object.assign({}, parent, child)
}, {})

export const override: Strategy = (_parent, child) => child

export const config = (p: OmnicConfig, c: OmnicConfig, customStrategy?: ConfigMergeStrategyObject) => baseMerge(p, c, (parent, child) => {
  const configMergeStrategy: ConfigMergeStrategyObject = customStrategy || {
    beforeEach: pipe,
    afterEach: reversePipe,
    url: concatURL,
    headers: merge,
    body: override,
    integrity: override,
    keepalive: override,
    referrer: override,
    params: override,
    cache: override,
    credentials: override,
    mode: override,
    redirect: override,
    referrerPolicy: override
  };

  return keysOf(configMergeStrategy).reduce((config, key) => {
    const parentProp = parent[key];
    const childProp = child[key];

    config[key] = configMergeStrategy[key](parentProp, childProp);

    return config;
  }, {} as OmnicConfig);
}, {})

/**
 * Merges all the configs accroding to a specific strategy
 *
 * mergeConfigs(parentConfig, OmnicConfig, (optionalConfig || {})) => a single config
 *
 * @export
 * @param { OmnicConfig[] } configs to merge
 * @returns { OmnicConfig } final merged config
 */
export function mergeConfigs(...configs: OmnicConfig[]): OmnicConfig {
  return configs.reduce((p, c) => config(p, c));
}

export function mergeConfigsWithStrategy(strategy: ConfigMergeStrategyObject, ...configs: OmnicConfig[]): OmnicConfig {
  return configs.reduce((p, c) => config(p, c, strategy));
}
