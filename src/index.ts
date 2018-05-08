import { omnicFactory, aliases } from './omnic'

const route = omnicFactory()
const { CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE } = aliases

export default route

export { omnicFactory, CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE }
