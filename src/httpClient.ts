import { URLSearchParams } from 'url';
import fetch from 'node-fetch';
import { removeSlash } from './utils';

export const createApiClient = (apiUrl: string) => {
  return <T>(path: string, params: any): Promise<T> => {
    const apiEndpoint = [removeSlash(apiUrl), removeSlash(path, false)].join('/');
    const queryParams = new URLSearchParams(<any>params);

    return new Promise(async (resolve, reject) => {
      try {
        const requestUrl = [apiEndpoint, queryParams.toString()].filter(Boolean).join('?');
        const response = await fetch(requestUrl);
        resolve(response.json());
      } catch (e) {
        reject(e);
      }
    });
  };
};
