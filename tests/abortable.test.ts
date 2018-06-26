import Abortable from '../src/abortable';

describe('AbortablePromise', () => {
  it('doesn\'t contain unneeded undefineds', () => {
    const promise = new Abortable.Promise(_abort => (resolve, _reject) => { resolve() });

    Object.getOwnPropertyNames(promise).forEach(i => expect(promise[i]).toBeDefined());
  });

  it('behaves like a promise', () => {
    const resolved = new Abortable.Promise(_abort => (resolve, _reject) => {
      resolve(true);
    });

    resolved.then(value => expect(value).toBe(true));
    resolved.catch(console.log);

    const rejected = new Abortable.Promise(_abort => (_resolve, reject) => {
      reject(true);
    });

    rejected.catch(value => expect(value).toBe(true));

    const finaled = new Abortable.Promise(_abort => (_resolve, reject) => {
      reject(true);
    });

    const mock = jest.fn(() => { return 'yay'; })
    let mockPromise = new Promise((resolve, _reject) => {
      setTimeout(() => {
        resolve(mock());
      }, 200);
    });

    finaled
      .finally(() => mockPromise.then(value => expect(value).toBe('yay')))
      .catch(() => {
        mockPromise.then(() => {
          expect(mock).toHaveBeenCalled();
        });
      });
  });
});
