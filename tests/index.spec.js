//@ts-check

import 'whatwg-fetch'

import route, { GET, POST, omnicFactory as R } from '../src'

describe('asd', () => {
  const API = route.with('https://jsonplaceholder.typicode.com/')({
    users: GET(),
    posts: route({
      all: GET(''),

      get: postId => GET(postId),
      comments: postId => GET(postId + '/comments')
    }),


  });

  it('asd', async () => {

    console.log(await (await API.posts.get(1)()).json());
    expect(true).toBe(true)
  })
})
