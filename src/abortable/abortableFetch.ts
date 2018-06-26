import AbortablePromise from './abortablePromise';

export default function abortableFetch(input?: string | Request, init?: RequestInit) {
  const signal = init ? init.signal : input ? input['signal'] : undefined;
  const abortController = signal ? undefined : new AbortController();

  const promise = new AbortablePromise<Response>(fetch(input, init), abortController);

  if (signal) {
    promise.signal = signal;
    promise.abort = () => signal!.dispatchEvent(new Event('abort'));
  }

  return promise;
}
