//@ts-check

import route from '../index'
const { GET, POST } = route;

describe('asd', () => {
  const API = route({
    api: route({
      users: GET({
        path: 'user/list'
      }),

      user: userId => route({
        get: GET({
          path: userId
        }),

        posts: GET({
          path: 'post'
        }),

        post: route({
          add: POST(),
          get: postId => GET({
            path: postId
          })
        }),
      }),

      isUp: GET({
        path: ''
      })
    })
  }).api;

  it('asd', () => expect(true).toBe(true))
})
