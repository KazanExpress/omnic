/// @ts-check
/// <reference path="../types/index.d.ts" />
import api from "../index";

describe('api', () => {
  it('accepts single root method', () => {
    expect(api('GET')).toBeTruthy();
    expect(api({
      GET: {
        body: 'asd'
      }
    })).toBeTruthy();

    expect(api.with({
      method: 'GET'
    })()).toBeTruthy();

    // const API = api('GET');

    // expect(API).toHaveProperty('bind');
  })
})
