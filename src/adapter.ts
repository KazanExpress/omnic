import CancellablePromise from "./cancellablePromise";

export default abstract class Adapter {
  public abstract request<T>(url: string, config: RequestInit): CancellablePromise<T>;
}

export class DefaultAdapter extends Adapter {
  public request<T = Response>(url: string, config: RequestInit) {
    const controller = new AbortController();
    config = {
      signal: controller.signal,
      ...config
    }

    return new CancellablePromise<T>(fetch(url, config), controller);
  }
}

export class DefaultJsonAdapter extends DefaultAdapter {
  public request<T>(url: string, config: RequestInit) {
    const response = super.request(url, config);

    return new CancellablePromise<T>((resolve, reject) => {
      response.then(resp => resp.json().then(resolve).catch(reject)).catch(reject)
    }, { signal: response.signal, abort: response.cancel });
  }
}

export class DefaultStreamAdapter extends DefaultAdapter {
  public request<T = ReadableStream | null>(url: string, config: RequestInit) {
    const response = super.request(url, config);

    return new CancellablePromise<T>((resolve, reject) => {
      response.then(resp => resolve(resp.body)).catch(reject)
    }, { signal: response.signal, abort: response.cancel });
  }
}
