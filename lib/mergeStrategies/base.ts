export type MergeStrategy<
  Arg = any,
  Result extends Arg = Arg
> = (parent: Arg, child: Arg) => Result;

export type MergeStrategyFactory = {
  <Arg = any, Result extends Arg = Arg>(
    strategy: (
      parent: Exclude<Arg, undefined>,
      child: Exclude<Arg, undefined>,
    ) => Exclude<Result, undefined>,
  ): <A extends Arg | undefined = Arg, R extends Arg | undefined = A>(parent: A, child: A) => R,

  <Arg = any, Result extends Exclude<Arg, undefined> = Exclude<Arg, undefined>>(
    strategy: (
      parent: Exclude<Arg, undefined>,
      child: Exclude<Arg, undefined>,
    ) => Exclude<Result, undefined>,
    defaultResult: Result
  ): <A extends Arg | undefined = Arg, R extends Exclude<Arg, undefined> = Result>(parent: A, child: A) => R
};

/**
 * Filters out all the undefineds from arguments or at least mixes them into resulting types with a bunch of dynamic type inference
 *
 * @template Arg is the generic type of the merging arguments
 * @template Result is the resulting type of merging
 * @param strategy must be a predictable merge strategy function that doesn't accept nor doesn't return any undefined value
 * @param [defaultResult] is a default value in case of one of arguments being undefined
 */
export const mergeStrategyFactory: MergeStrategyFactory = (
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
