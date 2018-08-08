import { mergeStrategyFactory, MergeStrategy } from '../../lib/mergeStrategies/base';

describe('base merge wrapper', () => {
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

    const mergeStr = mergeStrategyFactory<number>((parent, child) => parent + child);
    const result1 = mergeStr(b, a());
    const result2 = mergeStr(b, a());
    const result3 = mergeStr(b, c);

    expect(result1).toBe(3);
    expect(result2).toBe(5);
    expect(result3).toBe(7);
  });
});
