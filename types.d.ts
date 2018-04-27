type OmnicMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type OmnicHook = (url: string, config) => any

interface OmnicConfig {
  beforeEach?: OmnicHook
  afterEach?: OmnicHook
  path?: string | number
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

interface OmnicRequestConfig extends OmnicConfig {
  method: OmnicMethod
}

interface Omnic {
  <T extends BaseTree>(routeBase: T): OmnicApiTree<T>
  <T = any>(requestConfig: OmnicRequestConfig): OmnicRequest<T>
}

interface OmnicAlias {
  <T>(config?: OmnicConfig | string | number): OmnicRoute<T>
}

interface OmnicRequest<T> {
  (requestConfig?: OmnicConfig | string | number): Promise<T>
  ['__omnic__']: true
}

interface OmnicRoute<T> {
  <U>(parentConfig: U, key?: string): U extends OmnicConfig | string | number ? OmnicRequest<T> : U
  ['__omnic_route__']: true
}

type BaseTree = {
  [key: string]: OmnicRoute<any> | ((...args) => OmnicRoute<any>) | OmnicApiTree<any> | ((...args) => OmnicApiTree<any>)
}

type OmnicApiTree<O extends BaseTree> = {
  [key in keyof O]: O[key] extends OmnicRoute<any> ? ReturnType<O[key]> : O[key] extends (...args) => OmnicRoute<infer T> ? ReturnType<OmnicRoute<T>> : O[key]
}
