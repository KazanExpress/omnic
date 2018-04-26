import {
  baseMerge,
  override,
  concat,
  pipe,
  reversePipe,
  merge,
  config,
  mergeConfigs
} from '../../src/misc/mergeStrategies'

describe('baseMerge', () => {
  it('returns child if no parent', () => {
    const parent = null;
    const child = 'child';

    expect(baseMerge(parent, child)).toBe(child);
  })

  it('returns parent if no child', () => {
    const parent = 'parent';
    const child = null;

    expect(baseMerge(parent, child)).toBe(parent);
  })

  it('returns undefined if both are empty', () => {
    const parent = null;
    const child = null;

    expect(baseMerge(parent, child)).toBe(undefined);
  })

  it('applies a strategy if both a present', () => {
    const parent = 'parent';
    const child = 'child';
    const strategy = (_parent, _child) => {
      expect(_parent).toBe(parent)
      expect(_child).toBe(child)

      return (_parent + _child);
    }

    expect(baseMerge(parent, child, strategy)).toBe('parentchild');
  })
})

describe('misc strategies', () => {
  test('override', () => {
    const parent = 'parent';
    const child = 'child';

    expect(override(parent, child)).toBe(child);
  })

  test('concat', () => {
    const parent = 'parent';
    const child = 'child';

    expect(concat(parent, child)).toBe('parent/child');
  })

  test('pipe', () => {
    let arr = [];
    const parent = (arg) => arr.push('parent' + arg);
    const child = (arg) => arr.push('child' + arg);
    const piped = pipe(parent, child);

    piped('/');

    expect(arr).toEqual(['parent/', 'child/']);
  })

  test('reversePipe', () => {
    let arr = [];
    const parent1 = (arg) => arr.push('parent' + arg);
    const parent2 = (arg) => arr.push('parent' + arg + arg);
    const child = (arg) => arr.push('child' + arg);
    const piped = reversePipe(reversePipe(parent1, child), parent2);

    piped('/');

    expect(arr).toEqual(['parent//', 'child/', 'parent/']);
  })

  test('merge', () => {
    let parent = {
      a: undefined,
      b: 'bambuka'
    };
    let child = {
      c: 'cat'
    };

    expect(merge(parent, child)).toEqual({
      b: 'bambuka',
      c: 'cat'
    });

    parent = undefined;

    expect(merge(parent, child)).toEqual({
      c: 'cat'
    });
  })

  test('config', () => {
    let parentConfig = {
      path: 'parent',
      headers: {
        'Accept': 'application/json'
      }
    };
    let childConfig = {
      path: 'child',
      headers: {
        'Content-Type': 'application/xml'
      }
    };
    let otherConfig = null;

    let mergedConfig = config(parentConfig, childConfig);

    expect(mergedConfig.path).toEqual('parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })

    mergedConfig = config(mergedConfig, otherConfig);

    expect(mergedConfig.path).toEqual('parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })

    otherConfig = { path: 'https://someserver.com/api' };

    mergedConfig = config(otherConfig, mergedConfig);

    expect(mergedConfig.path).toEqual('https://someserver.com/api/parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })
  })
})
