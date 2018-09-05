import { override } from 'omnic/mergeStrategies';

describe('Merge Strategies: override', () => {
  it('overrides whatever is sent into it first', () => {
    expect(override(2, 3)).toEqual(3);
    expect(override('2, 3', 'bar')).toEqual('bar');
    expect(override({}, { bar: 'bar'})).toHaveProperty('bar', 'bar');
  });

  it('follows the base merge wrapper rules', () => {
    expect(override('2, 3', undefined)).toEqual('2, 3');
  });
});
