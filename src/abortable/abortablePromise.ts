type PromiseArg<T> = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
type AbortablePromiseArg<T> = (abort: (reason?: any) => void) => PromiseArg<T>;

export default class AbortablePromise<T = any> implements AbortController, Promise<T> {
  [Symbol.toStringTag]: 'Promise';

  /// TODO:
  static all<T>() { return new AbortablePromise<T[]>(Promise.all<T>(arguments[0])); };
  static race<T>() { return new AbortablePromise<T>(Promise.race<T>(arguments[0])); };
  static reject<T>() { return new AbortablePromise<T>(Promise.reject<T>(arguments[0])); };
  static resolve<T>() { return new AbortablePromise<T>(Promise.resolve<T>(arguments[0])); };
  static abort<T = never>(reason?: any) {
    return new AbortablePromise<T>((abort) => (_resolve, _reject) => {
      abort(reason);
    });
  }

  constructor(
    executor: Promise<T> | AbortablePromiseArg<T>,
    abortController?: AbortController
  ) {
    this['[[AbortController]]'] = abortController || new AbortController();
    this.signal = this['[[AbortController]]'].signal;
    this.abort = this['[[AbortController]]'].abort.bind(this['[[AbortController]]']);

    if (typeof executor === 'function') {
      this['[[Promise]]'] = new Promise<T>(executor(reason => {
        this.abort();


        if ((reason && (reason.valueOf && (reason.valueOf() || true))) && typeof console !== 'undefined' && console) {
          console.warn('Promise Abort:', reason);
        }
      }));

      this._isPromiseWrapper = true;
    } else {
      this['[[Promise]]'] = executor as Promise<T>;
    }

    this.then = this['[[Promise]]'].then.bind(this['[[Promise]]']);
    this.catch = this['[[Promise]]'].catch.bind(this['[[Promise]]']);
    this['[[Promise]]'].finally && (this.finally = this['[[Promise]]'].finally.bind(this['[[Promise]]']));
  }

  protected _isPromiseWrapper: boolean = false;
  protected '[[Promise]]': Promise<T>;
  protected '[[AbortController]]': AbortController;

  get aborted() { return this.signal.aborted; }

  then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
  catch: <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>;
  finally: (onfinally?: (() => void) | null) => Promise<T> = () => Promise.reject();
  abort: () => void;
  signal: AbortSignal;
}
