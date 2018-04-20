import RequestAdapter from './index'

export class FetchAdapter extends RequestAdapter {
  request (url, config) {
    [url, config] = super.processParams(url, config)
    return fetch(url, config)
  }
}
