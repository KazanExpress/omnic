import { getQueryString } from './misc'

export default class {
  async request (url, config) {
    [url, config] = this.processParams(url, config)
    console.log(url)
    return (await fetch(url, config)).json()
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
