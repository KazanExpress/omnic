import { mergeStrategyFactory } from 'omnic/mergeStrategies/base';

describe('Merge Strategies: base merge wrapper', () => {
  it('returns undefined if both args are undefined', () => {
    const merge = mergeStrategyFactory((parent, child) => parent + child);
    expect(merge(undefined, undefined)).toBe(undefined);
  });

  it('returns one arg if other is undefined', () => {
    const merge = mergeStrategyFactory((parent, child) => parent + child);
    expect(merge(2, undefined)).toBe(2);
    expect(merge(undefined, 3)).toBe(3);
  });

  it('determines undefineds statically', () => {
    let isFirst = true;
    function a() {
      if (isFirst) {
        isFirst = false;
        return undefined;
      }

      return 2;
    }
    let b = 3;
    let c = 4;

    const mergeStr = mergeStrategyFactory((parent, child) => parent + child);

    /// Type should be: number | undefined
    const result1 = mergeStr(b, a());

    /// Type should be: number | undefined
    const result2 = mergeStr(b, a());

    /// Type should be: number
    const result3 = mergeStr(b, c);

    /// Type should be: undefined
    const result4 = mergeStr(undefined, undefined);

    expect(result1).toBe(3);
    expect(result2).toBe(5);
    expect(result3).toBe(7);
    expect(result4).toBe(undefined);
  });
});
