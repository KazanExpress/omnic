type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PATCH'
type Hook = (url: string, path: string[], config) => any
type Alias = (config?) => Promise<any>

type WithAliases<T> = T & {
  readonly [method in Method]: Alias & {
    __omnic_method__: method
  }
}

interface LeafConfig {
  beforeEach?: Hook
  afterEach?: Hook
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

interface Config extends LeafConfig {
  method?: Method
}


interface OmnicFactory {
  (...stuff): Omnic
}


type Omnic = WithAliases<{
  <T>(routes: T): T
  readonly with: OmnicFactory
}>
