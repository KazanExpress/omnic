import { getQueryString } from '../misc'

export class RequestAdapter {
  request (url, config) {
    [url, config] = this.processParams(url, config)
    return fetch(url, config)
  }

  processParams (url, config) {
    if (config.params) {
      let query = getQueryString(config.params).strip()

      if (query) {
        url = url + (~url.indexOf('?') ? '&' : '?') + query
      }
    }

    return [url, config]
  }
}
