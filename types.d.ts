type OmnicMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
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

interface OmnicRequestConfig extends OmnicConfig {
  method: OmnicMethod
}

interface Omnic {
  // <U extends { [key: string]: OmnicRoute<any> | ((...args) => OmnicRoute<any>) }, T = any>(routeBase: U)
    // : U extends OmnicRequestConfig ? OmnicRequest<T> : OmnicApiTree<U>
  <U>(routeBase: U): U
}

interface OmnicAlias {
  <T>(config?: OmnicConfig | string | number): OmnicRequest<T>//OmnicRoute<T>
}

interface OmnicRequest<T> {
  (requestConfig?: OmnicConfig | string | number): Promise<Response<T>>
  ['__omnic__']: true
}

interface OmnicRoute<T> {
  <U>(parentConfig: U, key?: string): U extends OmnicConfig | string | number ? OmnicRequest<T> : U
  ['__omnic_route__']: true
}

// type OmnicRouteTree<O extends { [key: string]: ((...args) => any) | OmnicApiTree<any> }> = {
//   [key in keyof O]: O[key] extends (...args) => any ? ReturnType<O[key]>
// }

// type OmnicApiTree<O extends { [key: string]: ((...args) => any) | OmnicApiTree<any> }> = {
//   [key in keyof O]: O[key] extends (...args) => any ? ReturnType<O[key]> : O[key] extends OmnicApiTree<any> ? OmnicApiTree<O[key]> : any
// }
