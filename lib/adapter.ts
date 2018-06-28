import { OmnicRequestInit } from './types';

export default abstract class Adapter {
  public abstract request(url: string, config: RequestInit): Promise<any>;
}

export class DefaultAdapter extends Adapter {
  public request(url: string, config: OmnicRequestInit) {
    const params = this.encodeParams(config.params || {});

    if (params) {
      url = url + (~url.indexOf('?') ? '&' : '?') + params;
    }

    return fetch(url, config);
  }

  private encodeParams(params: { [key: string]: string | string[] }) {
    const getQueryString = () => {
      const toUri = k => val => val !== undefined ? `${encodeURIComponent(k)}=${encodeURIComponent(val)}` : '';

      return Object.keys(params)
        .map(k => {
          if (!Array.isArray(params[k])) {
            return toUri(k)(params[k]);
          }

          return (params[k] as string[])
            .map(toUri(k))
            .filter(p => p)
            .join('&');
        })
        .filter(k => k)
        .join('&');
    };

    return getQueryString().trim()
  }
}


// Do we even need these two here?

export class DefaultJsonAdapter extends DefaultAdapter {
  public request(url: string, config: OmnicRequestInit) {
    return new Promise<any>((resolve, reject) => {
      super.request(url, config).then(resp => resp.json().then(resolve).catch(reject)).catch(reject);
    });
  }
}
