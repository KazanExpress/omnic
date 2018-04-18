import api from './index'

const customAPI = api.with({
  useObjectPathsAsRoutes: true
}, (url, response) => {
  return response;
})

let API = customAPI({
  main: {
    method: {
      // config here
    }
  }
})

console.log(await API.main.method());

API = api('GET');

console.log(await API());
