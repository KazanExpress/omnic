//@ts-check

import 'whatwg-fetch'

import route, { GET, POST } from '../src'

describe('asd', () => {
  const API = route.with('https://jsonplaceholder.typicode.com/')({
    users: GET(),
    posts: route({
      all: GET(''),

      get: postId => GET(postId),
      comments: postId => GET(postId + '/comments'),

      // internal: route.with('https://jsonplaceholder.typicode.com/')({
      //   onlyPost: GET('posts/1')
      // })
    })
  });

  it('asd', async () => {
    // console.log(API)
    console.log(await (await API.users()).json());
    console.log(await (await API.posts.all()).json());
    console.log(await (await API.posts.get(1)()).json());
    console.log(await (await API.posts.comments(1)()).json());
    // console.log(await (await API.posts.internal.onlyPost()).json());
    expect(true).toBe(true)
  })
})
