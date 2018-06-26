import AbortablePromise from './abortablePromise';
import abortableFetch from './abortableFetch';

export default Object.freeze({
  Promise: AbortablePromise,
  fetch: abortableFetch
});
