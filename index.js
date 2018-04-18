/**
 *
 *
 * @export
 * @param {Route | RouteLeaf} routes
 */
function api(routes) {
  return routes
}
/**
 *
 *
 * @param {any} stuff
 * @returns {api} instance
 */
api.with = function (...stuff) {
  return api;
}

export default api;
