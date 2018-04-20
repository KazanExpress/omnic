import { getQueryString } from '../misc'

export class RequestAdapter {
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
