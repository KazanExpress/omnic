type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE' | 'PATCH'

type Hook = (url: string, config, next: () => void) => void;

interface BaseRoute {
  beforeEach: Hook
  afterEach: Hook
}

interface RouteConfig extends BaseRoute {
  method: Method
  path: string
}

interface Route extends BaseRoute {
  [path: string]: RouteConfig | BaseRoute | ((...params) => BaseRoute)
}

const a: RequestInit = {
  body,
  cache,
  credentials,
  headers,
  integrity,
  keepalive,
  method,
  mode,
  redirect,
  referrer,
  referrerPolicy,
  signal,
  window
}
