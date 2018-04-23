function baseMerge (parent, child, strategy) {
  if (parent && child) {
    return strategy(parent, child)
  } else if (!parent) {
    return child
  } else if (!child) {
    return parent
  } else {
    return undefined
  }
}

export const pipe = (parent, child) => baseMerge(parent, child, (parent, child) => function () { parent(arguments); child(arguments); })

export const reversePipe = (parent, child) => pipe(child, parent)

export const concat = (parent, child) => baseMerge(parent, child, (parent, child) => parent + child)

//TODO account for Headers class and string[][]
export const merge = (parent, child) => baseMerge(parent, child, (parent, child) => ({ ...parent, ...child }))

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

  const finalConfig = {}

  for (const key in parent) {
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
 * @param { Config[] } configs to merge
 * @returns { Config } final merged config
 */
export function mergeConfigs(...configs) {
  return configs.reduce(config)
}
