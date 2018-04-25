import { omnicFactory, aliases } from './omnic'

export default omnicFactory()

const { CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE } = aliases

export { omnicFactory, CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE }
