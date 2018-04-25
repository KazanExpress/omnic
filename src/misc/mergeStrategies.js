import { urlRegex } from '.'

export const keysOf = Object.getOwnPropertyNames;

export function baseMerge (parent, child, strategy) {
  if (parent && child) {
    return strategy(parent, child)
  } else if (!parent && child) {
    return child
  } else if (!child && parent) {
    return parent
  } else {
    return undefined
  }
}

export const pipe = (parent, child) => baseMerge(parent, child, (parent, child) => function () { parent(...arguments); child(...arguments); })

export const reversePipe = (parent, child) => pipe(child, parent)

export const concat = (parent, child) => baseMerge(parent, child, (parent, child) => {
  const processPath = path => path.match(/\/?[\w\d\.\:\@]+/g).join('')
  const parentUris = parent.split('//')
  if (parentUris.length > 1)
    return parentUris[0] + '//' + processPath(parentUris[1] + '/' + child)
  else
    return processPath(parent + '/' + child)
})

export const merge = (parent, child) => baseMerge(parent, child, (parent, child) => {
  //TODO? maybe account for Headers class and string[][]
  return ({ ...parent, ...child })
})

export const override = (parent, child) => baseMerge(parent, child, (parent, child) => child)

export const config = (parent, child) => baseMerge(parent, child, (parent, child) => {
  const configMergeStrategies = {
    beforeEach: pipe,
    afterEach: reversePipe,
    path: concat,
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
  }

  const keys = keysOf(parent).concat(keysOf(child))
  const finalConfig = {}

  for (const key of keys) {
    const parentProp = parent[key]
    const childProp = child[key]

    finalConfig[key] = configMergeStrategies[key](parentProp, childProp)
  }

  return finalConfig
})

/**
 * Merges all the configs accroding to a specific strategy
 *
 * mergeConfigs(parentConfig, OmnicConfig, (optionalConfig || {})) => a single config
 *
 * @export
 * @param { OmnicConfig[] } configs to merge
 * @returns { OmnicConfig } final merged config
 */
export function mergeConfigs(...configs) {
  return configs.reduce(config)
}
