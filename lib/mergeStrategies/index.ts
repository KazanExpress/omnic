import { keysOf } from 'omnic/misc'
import { OmnicConfig } from 'omnic/types'
import { mergeStrategyFactory } from './base'

type pipedFunction = (...args: any[]) => any[];

export const pipe = mergeStrategyFactory<pipedFunction>(
  (parent, child) => (
    (...args) => child.apply(
      child,
      parent.apply(parent, args)
    )
  )
)

export const reversePipe = (parent: pipedFunction, child: pipedFunction) => pipe(child, parent)

export const concatURLs = mergeStrategyFactory<URL | string, URL>((parent, child) => {
  if (child instanceof URL)
    child = String(child)

  return new URL(child, parent)
})

export const merge = <P, C = P>(
  parent: P, child: C
): P extends undefined ? C : C extends undefined ? P : P & C => {
  const strategy = mergeStrategyFactory<P | C | (C & P)>((_p, _c) => ({
    //@ts-ignore
    ..._p,
    ..._c
    //@ts-ignore
  }), {});

  return strategy(parent, child);
}

const merged = merge({ a: 'a' }, undefined);
const merged2 = merge(undefined, { b: 2 });
const merged3 = merge({ a: 'a' }, { b: 2 });

export const override = mergeStrategyFactory((_parent, child) => child)

export const config = mergeStrategyFactory<OmnicConfig>((parent, child) => {
  const configMergeStrategies: { [key in keyof OmnicConfig]-?: Function } = {
    beforeEach: pipe,
    afterEach: reversePipe,
    url: concatURLs,
    headers: merge,
    params: merge,
    body: override,
    integrity: override,
    keepalive: override,
    referrer: override,
    cache: override,
    credentials: override,
    mode: override,
    redirect: override,
    referrerPolicy: override,
    adapter: override,
    method: override,
    signal: override
  }

  const keys = keysOf(configMergeStrategies)
  const finalConfig = {} as OmnicConfig

  for (const key of keys) {
    const parentProp = parent[key as keyof OmnicConfig]
    const childProp = child[key as keyof OmnicConfig]

    finalConfig[key as keyof OmnicConfig] = configMergeStrategies[key as keyof OmnicConfig](parentProp, childProp)
  }

  return finalConfig
}, {})

export function mergeConfigs(...configs: (OmnicConfig | undefined)[]) {
  return configs.reduce(config) as OmnicConfig // Sorry, typescript, I know better! 😁
}
