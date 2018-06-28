import route, { GET, POST, DELETE } from '../lib'

const API = route.with({
  afterEach: response => response.json()
})({
  users: GET<User[]>(''),
  user: (userId: number) => route({
    get: route<User>({
      method: 'GET',
      path: userId
    }),
    post: {
      get: (postId: number) => route({
        get: GET<Post>(postId),
        delete: DELETE<Post>(postId)
      }),
      add: POST
    }
  })
});

interface User {
  username: string
  name: string
  birthDate: Date
}

interface Post {
  title: string
  text: string
  created: Date
}

API.users().then(users => {
  users[0].username
})

API.user(1).get().then(user => {
  user.username
})

API.user(1).getPost(2).get().then(post => {
  post.text
})


///////////////////////////////////////////////////////////////////////////


const API2 = route.with({
  path: 'https://jsonplaceholder.typicode.com/',
  afterEach(request) {
    return request.json()
  }
})({
  users: GET<User[]>(),
  posts: route({
    all: GET<Post[]>(''),

    get: (postId: number) => GET<Post>(postId),
    comments: postId => GET<Post>(postId + '/comments'),

    internal: route.with('https://jsonplaceholder.typicode.com/')({
      onlyPost: GET('posts/1')
    })
  })
});

API2.posts.get(2)()
