export type MergeStrategy<
  Arg = any,
  Result = Arg
> = (parent: Exclude<Arg, undefined>, child: Exclude<Arg, undefined>) => Result;

export const mergeStrategyFactory: {
  <Arg = any, Result = Arg>(
    strategy: MergeStrategy<Arg, Result>
  ): (parent: Arg, child: Arg) => Result,

  <Arg = any, Result = Arg>(
    strategy: MergeStrategy<Arg, Result>,
    defaultResult: Exclude<Result, undefined>
  ): (parent: Arg, child: Arg) => Exclude<Result, undefined>
} = function(strategy, defaultResult?) {
  return function(parent, child) {
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
}
