//@ts-check

import 'whatwg-fetch'

import route, { GET, POST } from '../src'

describe('asd', () => {
  const API = route.with({
    path: 'https://jsonplaceholder.typicode.com/',
    afterEach(request) {
      return request.json()
    }
  })({
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
    console.log(await API.users());
    console.log(await API.posts.all());
    console.log(await API.posts.get(1)());
    console.log(await API.posts.comments(1)());
    // console.log(await API.posts.internal.onlyPost());
    expect(true).toBe(true)
  })
})
