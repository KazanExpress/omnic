import { omnicFactory } from './src'

const route = omnicFactory();

const { GET, POST } = route;

const API = route({
  users: GET<User[]>(),

  user: id => route(GET<User>('user/' + id))()
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

API.user(2)
