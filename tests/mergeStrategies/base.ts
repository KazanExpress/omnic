import { baseMerge, MergeStrategy } from '../../lib/mergeStrategies/base';

describe('base merge wrapper', () => {
  it('determines undefineds statically', () => {
    const und: undefined = undefined;
    const a = 'asd';
    const b = 'bad';

    const mergeStr = baseMerge<string>((parent, child) => parent + '/' + child);

    mergeStr(und, a)
  });
});
