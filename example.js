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

await API.main.method({
  // Custom Fetch Config here
});

API = api('GET');

console.log(await API());
