import AbortablePromise from './abortable/abortablePromise';
import abortableFetch from './abortable/abortableFetch';

export default abstract class Adapter {
  public abstract request(url: string, config: RequestInit): Promise<any>;
}

export class DefaultAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return abortableFetch(url, config);
  }
}


// Do we even need these two?

export class DefaultJsonAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new AbortablePromise(_abort => (resolve, reject) => {
      abortableFetch(url, config).then(resp => resp.json().then(resolve).catch(reject)).catch(reject);
    });
  }
}

export class DefaultStreamAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new AbortablePromise<ReadableStream | null>(_abort => (resolve, reject) => {
      abortableFetch(url, config).then(resp => resolve(resp.body)).catch(reject);
    });
  }
}
