//@ts-check

import route from '../index'
const { GET, POST } = route;

describe('asd', () => {
  const API = route({
    users: GET(),
    posts: route({
      list: GET({ path: '' }),

      get: postId => ({ path: postId }),
      comments: postId => ({ path: postId + '/comments' })
    }),


  });

  it('asd', async () => {

    console.log(await (await API.users()).json());
    expect(true).toBe(true)
  })
})
