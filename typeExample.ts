import route, { GET, POST, DELETE } from './src'

const API = route({
  users: GET<User[]>(''),
  user: userId => route({
    get: GET<User>(userId),
    post: postId => route({
      get: GET<Post>(postId),
      delete: DELETE<Post>(postId)
    })
  })
})

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

API.users().then(r => r.json().then(users => {
  users[0].username
}))

API.user(1).get().then(r => r.json().then(user => {
  user.username
}))

API.user(1).post(2).get().then(r => r.json().then(post => {
  post.text
}))
