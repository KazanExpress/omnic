import Adapter from '../adapter';
import { methodAlias } from '../request';

export type OmnicMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE'
export type MethodCollection = { [Key in OmnicMethod]: typeof methodAlias }


export interface OmnicRequestInit extends RequestInit {
  params?: { [key: string]: string | string[] }
  method: OmnicMethod
}

export interface OmnicConfig extends OmnicRequestInit {
  // Hook to modify the fetch config right before sending the request
  beforeEach?: {
    (input: string, init: RequestInit): [string, RequestInit]
    (input: Request): Request
  }

  // Hook to process the response before returning it
  afterEach?: <T>(response: Response) => Promise<T>

  // A suburl path to send request to
  url?: string

  adapter?: Adapter
}

export type AcceptableConfig = OmnicConfig | string | number
