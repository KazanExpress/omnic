import route, { GET, POST, DELETE } from './src'

const API = route.with()({
  users: GET<User[]>(''),
  user: (userId: number) => route({
    get: route<User>({
      method: 'GET',
      path: userId
    }),
    getPost: (postId: number) => route({
      get: GET<Post>(postId),
      delete: DELETE<Post>(postId)
    })
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
