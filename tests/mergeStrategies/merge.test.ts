import { merge } from 'omnic/mergeStrategies';

describe('Merge Strategies: merge', () => {
  it('merges objects', () => {
    const merged = merge({ a: 'a' }, { b: 2 });
    expect(merged).toHaveProperty('a', 'a')
    expect(merged).toHaveProperty('b', 2);
  });

  it('merges undefineds using defaults', () => {
    const merged = merge({ a: 'a' }, undefined);
    expect(merged).toHaveProperty('a', 'a')
    expect(merged).not.toHaveProperty('b', 2);

    expect(merge(undefined, undefined)).toMatchObject({});
  });
});
