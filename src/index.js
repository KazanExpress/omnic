import { omnicFactory, aliases } from './omnic'

/**
 * @type { Omnic }
 */
const route = omnicFactory();

export default route

const { CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE } = aliases

export { omnicFactory, CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE }
