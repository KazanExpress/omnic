import { OmnicMethod } from "../types";

export const requestMark = '__omnic__';
export const routeMark = '__omnic_route__';

export const methods: OmnicMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];
