import { Adapter } from './types';

export default class implements Adapter {
  async request (url: string, config: RequestInit) {
    return fetch(url, config)
  }
}
