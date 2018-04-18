/// @ts-check
/// <reference path="../types/index.d.ts" />
import api from "../index";

describe('api.with', () => {
  it('accepts no arguments', () => {
    expect(api.with).not.toThrow();
    expect(api.with()).toHaveProperty('with');
    expect(typeof api.with()).toBe('function');
  })
})
