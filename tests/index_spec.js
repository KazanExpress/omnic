//@ts-check

import route from '../index'
const { GET, POST } = route;

console.log(route.GET)

describe('asd', () => {
  const API = route({
    users: GET(),
    posts: route({
      list: GET(''),

      get: postId => (postId),
      comments: postId => (postId + '/comments')
    }),


  });

  it('asd', async () => {

    console.log(await (await API.users()).json());
    expect(true).toBe(true)
  })
})
