import { omnicFactory, aliases } from './omnic'

/**
 * @type { Omnic }
 */
const route = omnicFactory()
const { CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE } = aliases

export default route

export { omnicFactory, CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE }
