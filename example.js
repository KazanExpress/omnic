import api from './index'

const customAPI = api.with({
  useObjectPathsAsRoutes: true
}, (url, response) => {
  return response;
})

const API = customAPI({
  main: {
    search: id => ({

    })
  }
})

