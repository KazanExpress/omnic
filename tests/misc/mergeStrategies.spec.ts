import {
  baseMerge,
  override,
  concatURL,
  pipe,
  reversePipe,
  merge,
  config,
  mergeConfigs
} from '../../src/misc/mergeStrategies'
import { OmnicConfig } from '../../src/types';

describe('baseMerge', () => {
  it('returns child if no parent', () => {
    const parent = null;
    const child = 'child';

    expect(baseMerge(parent, child, (...args) => args)).toBe(child);
  })

  it('returns parent if no child', () => {
    const parent = 'parent';
    const child = null;

    expect(baseMerge(parent, child, (...args) => args)).toBe(parent);
  })

  it('returns undefined if both are empty', () => {
    const parent = null;
    const child = null;

    expect(baseMerge(parent, child, (...args) => args)).toBe(undefined);
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
    const parent = 'http://parent';
    const child = 'child';

    expect(concatURL(parent, child)).toEqual(new URL('http://parent/child'));
  })

  test('pipe', () => {
    const parent = (arg) => 'parent' + arg;
    const child = (arg) => 'child' + arg;
    const piped = pipe(parent, child)!;

    expect(piped('/')).toEqual('childparent/');
  })

  test('reversePipe', () => {
    let arr: string[] = [];
    const parent1 = (arg) => ('parent1' + arg);
    const parent2 = (arg) => ('parent2' + arg);
    const child = (arg) => ('child' + arg);
    const piped = reversePipe(reversePipe(parent1, child)!, parent2)!;

    expect(piped('/')).toEqual('childparent1parent2');
  })

  test('merge', () => {
    let parent: any = {
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
      url: 'parent',
      headers: {
        'Accept': 'application/json'
      }
    };
    let childConfig = {
      url: 'child',
      headers: {
        'Content-Type': 'application/xml'
      }
    };

    //@ts-ignore
    let otherConfig: OmnicConfig = null;

    let mergedConfig = config(parentConfig, childConfig);

    expect(mergedConfig.url).toEqual('parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })

    mergedConfig = config(mergedConfig, otherConfig);

    expect(mergedConfig.url).toEqual('parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })

    otherConfig = { url: 'https://someserver.com/api' };

    mergedConfig = config(otherConfig, mergedConfig);

    expect(mergedConfig.url).toEqual('https://someserver.com/api/parent/child');
    expect(mergedConfig.headers).toEqual({
      'Accept': 'application/json',
      'Content-Type': 'application/xml'
    })
  })
})
