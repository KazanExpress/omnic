import RequestAdapter from './index'

export class FetchAdapter extends RequestAdapter {
  request (url, config) {
    [url, config] = this.processParams(url, config)
    return fetch(url, config)
  }
}
