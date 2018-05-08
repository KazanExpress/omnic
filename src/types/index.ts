export type OmnicMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
export type OmnicHook = (url: string, config: OmnicConfig) => any
export type WithFunction<T> = T | ((...args: any[]) => T)
export type Boxed<T> = { [key: string]: T }

export interface OmnicConfig {
  beforeEach?: (url: string, config: RequestInit) => [string, RequestInit]
  afterEach?: <T = any>(response: Response) => Promise<T>
  url?: string | number | URL
  body?: any
  integrity?: string
  keepalive?: boolean
  referrer?: string
  params?: Boxed<string>
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: HeadersInit
  mode?: RequestMode
  redirect?: RequestRedirect
  referrerPolicy?: ReferrerPolicy
}

export interface OmnicRequestConfig extends OmnicConfig {
  method: OmnicMethod
}

export type AcceptableConfig = OmnicConfig | string | number

export interface InternalConfig extends OmnicConfig {
  url?: URL
}

export interface Adapter {
  request(url: string, config: RequestInit): Promise<Response>
}

export type OmnicFactory = {
  (adapter?: Adapter, config?: AcceptableConfig): Omnic
  (config?: AcceptableConfig, adapter?: Adapter): Omnic
}

export interface Omnic {
  <T extends BaseTree>(routeBase: T): OmnicApiTree<T>
  <T = any>(requestConfig: OmnicRequestConfig): OmnicRoute<T>
  with: OmnicFactory
}

export interface OmnicAlias {
  <T>(config?: AcceptableConfig): OmnicRoute<T>
}

export interface OmnicRequest<T = any> {
  (requestConfig?: AcceptableConfig): Promise<T>
  ['__omnic__']?: true
}

export interface OmnicRoute<T = any> {
  <U>(parentConfig?: U, key?: string): U extends AcceptableConfig ? OmnicRequest<T> : U
  ['__omnic_route__']?: true
}

export type RouteTreeValue = WithFunction<OmnicRoute<any>> | WithFunction<OmnicRequest<any>>
export type RouteTreeFunction = Extract<RouteTreeValue, (...args: any[]) => any>

export type BaseTree = Boxed<RouteTreeValue>

export type OmnicApiTree<O extends BaseTree> = {
  [key in keyof O]: O[key] extends OmnicRoute<any> ? ReturnType<O[key]> : O[key] extends (arg: infer A) => OmnicRoute<infer T> ? ((arg: A) => ReturnType<OmnicRoute<T>>) : O[key]
}
