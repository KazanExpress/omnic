type OmnicMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type OmnicHook = (url: string, config) => any

interface OmnicConfig {
  beforeEach?: (url: string, config: RequestInit) => [string, RequestInit]
  afterEach?: <T = any>(response: Response) => Promise<T>
  path?: string | number //TODO: make URL
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

type AcceptableConfig = OmnicConfig | string | number

interface Adapter {
  request(url: string, config: RequestInit): Promise<Response>
  processParams(url: string, config: RequestInit): [string, RequestInit]
}

type OmnicFactory = {
  (adapter?: Adapter, config?: AcceptableConfig): Omnic
  (config?: AcceptableConfig, adapter?: Adapter): Omnic
}

type WithFactory<T> = T & { with: OmnicFactory }

type Omnic = WithFactory<{
  <T extends BaseTree>(routeBase: T): OmnicApiTree<T>
  <T = any>(requestConfig: OmnicRequestConfig): OmnicRequest<T>
}>

type OmnicAlias = WithFactory<{
  <T>(config?: AcceptableConfig): OmnicRoute<T>
}>

interface OmnicRequest<T = any> {
  (requestConfig?: AcceptableConfig): Promise<T>
  ['__omnic__']: true
}

interface OmnicRoute<T = any> {
  <U>(parentConfig: U, key?: string): U extends AcceptableConfig ? OmnicRequest<T> : U
  ['__omnic_route__']: true
}

type BaseTree = {
  [key: string]: OmnicRoute<any> | ((...args) => OmnicRoute<any>) | OmnicApiTree<any> | ((...args) => OmnicApiTree<any>)
}

type OmnicApiTree<O extends BaseTree> = {
  [key in keyof O]: O[key] extends OmnicRoute<any> ? ReturnType<O[key]> : O[key] extends (arg: infer A) => OmnicRoute<infer T> ? ((arg: A) => ReturnType<OmnicRoute<T>>) : O[key]
}
