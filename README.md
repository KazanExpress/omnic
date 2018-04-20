# omnic
> Epic declarative promise-based API client for the browser and node.js

`npm i -S omnic`

# Features

- Supports `fetch` as a default http client
- Make adapters for your own clients (XmlHttpRequest, other frameworks and etc.)
- Declarative and simple API description
- Promise support
- Transform request and response data and configs
- Intercept responses
- Cancel requests
- Automatically transforms request data to JSON
- Automatically encodes object params to URL params
- Customizable API factory


## Declarative API definitions

The main goal of `omnic` is to provide a simple and declarative way to write API clients. This enables you to strip repetative boilerplate code from your client's API definition and work with pure declarative structure instead.

### Examples

A very simple example would be a client for an API that returns collections of users and their blogposts:

```js
GET '/api/user/list' // Returns users data collection
GET '/api/user/{id}' // Returns a specific user data
GET '/api/user/{id}/post' // Returns a specific user blogpost collection
GET '/api/user/{id}/post/{id}' // Returns a specific user's blogpost
POST '/api/user/{id}/post' // Adds a specific user's blogpost

GET '/api' // Checks if API is up
```

Using `omnic`, the client for this API can be written very simply, like this:

```js
// client.js
import route from 'omnic'
const { GET, POST } = route;

export const API = route({
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
```

```js
import { API } from 'client.js'

// Continue only if the API is up
API.isUp().then(() => {
  API.users().then(/* Do something with the list of users here */);
  API.user(2).get().then(/* Do something with the 2nd user's data */);
  API.user(2).posts().then(/* Do something with the 2nd user's posts */);
  API.user(2).post.add({ body: {/* Add post to user */} }).then(/* do something after this */);
  API.user(2).post.get(1).then(/* Do something with the 2nd user's first post */);
});
```
