const a: RequestInit = {
  body,
  cache,
  credentials,
  mode,
  redirect,
  referrerPolicy,
  signal
}

type Body = typeof a.body;
type Cache = typeof a.cache;
type Credentials = typeof a.credentials;
type Mode = typeof a.mode;
type Redirect = typeof a.redirect;
type ReferrerPolicy = typeof a.referrerPolicy;
type Signal = typeof a.signal;

type Params = { [key: string]: string };

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PATCH';

type Hook = (url: string, config, next: () => void) => void;

interface BaseRoute {
  beforeEach: Hook
  afterEach: Hook
}

interface RouteConfig extends BaseRoute {
  method: Method
  path?: string
  params?: Params
  body?: Body
  cache?: Cache
  credentials?: Credentials
  headers?: HeadersInit
  integrity?: string
  keepalive?: boolean
  mode?: Mode
  redirect?: Redirect
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  signal?: Signal
}

interface Route extends BaseRoute {
  [path: string]: RouteConfig | BaseRoute | ((...params) => BaseRoute)
}

interface Adapter {

}

type Interceptor = (url: string, response: any) => any;

type API = ((routes: Route | RouteConfig) => any) & { with: apiBuilder };

type apiBuilder = (...stuff: Array<RouteConfig | Adapter | Interceptor>) => API;
