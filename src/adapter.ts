import Abortable from './abortable'

export default abstract class Adapter {
  public abstract request(url: string, config: RequestInit): Promise<any>;
}

export class DefaultAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return Abortable.fetch(url, config);
  }
}


// Do we even need these two?

export class DefaultJsonAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new Abortable.Promise(_abort => (resolve, reject) => {
      Abortable.fetch(url, config).then(resp => resp.json().then(resolve).catch(reject)).catch(reject);
    });
  }
}

export class DefaultStreamAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new Abortable.Promise<ReadableStream | null>(_abort => (resolve, reject) => {
      Abortable.fetch(url, config).then(resp => resolve(resp.body)).catch(reject);
    });
  }
}
