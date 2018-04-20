import { getQueryString } from '../misc'

export class RequestAdapter {
  request(url, config) { return new Promise(); }

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
