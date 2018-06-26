export default class CancellablePromise<T> {
  [Symbol.toStringTag]: "Promise";
  cancel: () => void;
  signal: AbortSignal;
  then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
  catch: <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>;

  constructor(handler, abortController: AbortController) {
    const promise = typeof handler === 'function' ? new Promise<T>(handler) : handler as Promise<T>;
    this.then = promise.then;
    this.catch = promise.catch;
    this.cancel = abortController.abort;
    this.signal = abortController.signal;
  }
}
