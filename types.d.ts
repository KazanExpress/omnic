type OmnicMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type OmnicHook = (url: string, config) => any

interface OmnicConfig {
  beforeEach?: OmnicHook
  afterEach?: OmnicHook
  path?: string
  body?: any
  integrity?: string
  keepalive?: boolean
  referrer?: string
  params?: { [key: string]: string }
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: HeadersInit
  mode?: RequestMode
  redirect?: RequestRedirect
  referrerPolicy?: ReferrerPolicy
}

interface RouteConfig extends OmnicConfig {
  method: string
}
