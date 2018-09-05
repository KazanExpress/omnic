export type MergeStrategy<
  P = any,
  C = P,
  R extends (P | C) = P
> = (parent: P, child: C) => R;

/**
 * Filters out all the undefineds from arguments or at least mixes them into resulting types with a bunch of dynamic type inference
 *
 * @template Arg is the generic type of the merging arguments
 * @template Result is the resulting type of merging
 * @param strategy must be a predictable merge strategy function that doesn't accept nor doesn't return any undefined value
 * @param [defaultResult] is a default value in case of one of arguments being undefined
 */
//@ts-ignore
export const mergeStrategyFactory = (
  strategy,
  defaultResult?
) => (parent, child) => {
  if (parent !== undefined && child !== undefined) {
    return strategy(parent, child)
  } else if (parent === undefined && child) {
    return child
  } else if (child === undefined && parent) {
    return parent
  } else {
    return defaultResult
  }
}
