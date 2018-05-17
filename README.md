# omnic (WORK IN PROGRESS)
> Epic declarative promise-based API client for the browser and node.js

`npm i -S omnic`

# Features

- Supports `fetch` as a default http client
- Make adapters for your own clients (XmlHttpRequest, other frameworks and etc.)
- Declarative and simple API description
- Promise support
- Transform request and response data and configs in hooks
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
// Importing the route constructor and specific request method constructors
import route, { GET, POST } from 'omnic';

// Creating a client factory with pre-set configuration
const generateClient = route.with({
  path: 'https://someserver.com/api',
  headers: { 'Authorization': 'Basic c29tZVVzZXJuYW1lOldvb29vb29vb3csIHdoYXQgYSBwYXNzd29yZCE=' }
});

// Generating a final API
export const API = generateClient({
  users: GET('user/list'),

  user: userId => route({
    get: GET(userId),
    posts: GET('post'),
    post: route({
      add: (post, followRedirect) => POST({
        body: post,
        redirect: followRedirect ? 'follow' : 'no-follow',
        path: ''
      }),
      get: postId => GET(postId)
    }),
  }),

  isUp: GET('')
});
```

```js
import { API } from 'client.js';

// Continue only if the API is up
API.isUp().then(() => {
  API.users().then(/* Do something with the list of users here */);
  API.user(2).get().then(/* Do something with the 2nd user's data */);
  API.user(2).posts().then(/* Do something with the 2nd user's posts */);

  // The second pair of braces is needed to send the resulting request
  API.user(2).post.add({ /* Add post to user */ })().then(/* do something after this */);
  API.user(2).post.get(1)().then(/* Do something with the 2nd user's first post */);
});
```

## Route configuration

Below is a full typed config that can be accepted by an alias function (`GET`, `POST` and etc.)

```ts
interface OmnicConfig {
  // Hook to modify the fetch config right before sending the request
  beforeEach: (url: string, config: RequestInit) => [string, RequestInit]

  // Hook to process the response before returning it
  afterEach: (response: Response) => Promise

  // A suburl path to send request to
  path: string | number

  // URL params (like '?param=1&another=two')
  params: object

  // Everything else is just a plain old fetch config
  body: any
  integrity: string
  keepalive: boolean
  referrer: string
  cache: "default" | "no-store" | "reload" | "no-cache" | "force-cache"
  credentials: "omit" | "same-origin" | "include"
  headers: object
  mode: "same-origin" | "navigate" | "no-cors" | "cors"
  redirect: "follow" | "error" | "manual"
  referrerPolicy: "" | "no-referrer" | "no-referrer-when-downgrade" | "origin-only" | "origin-when-cross-origin" | "unsafe-url"
}
```


The `route` function can also be used instead with an addition of another field: `method`.
