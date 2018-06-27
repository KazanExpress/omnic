export default abstract class Adapter {
  public abstract request(url: string, config: RequestInit): Promise<any>;
}

export class DefaultAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return fetch(url, config);
  }
}


// Do we even need these two here?

export class DefaultJsonAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new Promise((resolve, reject) => {
      fetch(url, config).then(resp => resp.json().then(resolve).catch(reject)).catch(reject);
    });
  }
}

export class DefaultStreamAdapter extends Adapter {
  public request(url: string, config: RequestInit) {
    return new Promise<ReadableStream | null>((resolve, reject) => {
      fetch(url, config).then(resp => resolve(resp.body)).catch(reject);
    });
  }
}
