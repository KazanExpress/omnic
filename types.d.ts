type OmnicMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type OmnicHook = (url: string, path: string[], config) => any

type OmnicAlias = {
  <T = any>(config?: OmnicConfig): (config?: OmnicConfig) => Promise<T>
  ['__omnic__']: true
}

type OmnicMethod<T = OmnicMethods> = {
  (url: string, config: OmnicConfig): OmnicAlias
  ['__omnic_method__']: T
}

type WithAliases<T> = T & {
  readonly [M in OmnicMethods]: OmnicAlias
}

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

type OmnicFactory = (...stuff) => OmnicRouteBuilder

type OmnicRouteBuilder = WithAliases<{
  <T>(routes: T): T
  readonly with: OmnicFactory
}>
