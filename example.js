import api from './index'

const customAPI = api.with({
  useObjectPathsAsRoutes: true
})

const API = customAPI({
  GET: {
    
  }
  // users: {
  //   user: id => ({

  //   })
  // }
})

// '/users/2'
API.users.user(2).then();


const customAPI2 = declareAPI.with({
  useObjectPathsAsRoutes: true
})

const API = customAPI2({
  addWishes: {
    route: 'favorites/add',
    requests: {
      post: {
        // Config here
      }
    }
  }
});
