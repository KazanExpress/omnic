type Cache = RequestCache;
type Credentials = RequestCredentials;
type Mode = RequestMode;
type Redirect = RequestRedirect;
type ReferrerPolicy = ReferrerPolicy;
type Signal = AbortSignal;
type Params = { [key: string]: string };
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PATCH';

type Hook = (url: string, config) => any;

interface BaseRoute {
  beforeEach?: Hook
  afterEach?: Hook
}

interface BaseConfig {
  path?: string
  body?: any
  integrity?: string
  keepalive?: boolean
  referrer?: string
  params?: Params
  cache?: RequestCache
  credentials?: RequestCredentials
  headers?: HeadersInit
  mode?: RequestMode
  redirect?: RequestRedirect
  referrerPolicy?: ReferrerPolicy
  signal?: AbortSignal
}

interface Config extends BaseConfig {
  method?: Method
}

type LeafConfig = Config & BaseRoute;
type LeafMethodConfig = BaseConfig & BaseRoute;
interface MethodConfigMap {
  [method in Method]?: LeafMethodConfig
};
type RouteConfig = LeafConfig | Method | Method[] | MethodConfigMap;

interface RouteTree extends BaseRoute {
  [path: string]: Route | ((...params) => Route)
  $config?: Config
}

type Route = RouteTree | RouteConfig;

type Adapter = {
  processParams(url: string, config: RequestInit): [string, RequestInit]
  request(customConfig: RequestInit): Promise<any>
};
type Interceptor = (url: string, response: any) => any;
type API = ((routes?: Route) => any) & { with: apiBuilder };

type apiBuilder = (...stuff: Array<LeafConfig | Adapter | Interceptor>) => API;
