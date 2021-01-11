import { URLSearchParams } from 'url';
import fetch from 'node-fetch';

const removeSlash = (subject: string, trailing = true) => {
  const pattern = trailing ? /\/$/ : /^\//;
  return subject.replace(pattern, '');
};

export const createApiClient = (apiUrl: string) => {
  return <T>(path: string, params: any): Promise<T> => {
    const apiEndpoint = [removeSlash(apiUrl), removeSlash(path, false)].join('/');
    const queryParams = new URLSearchParams(<any>params);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch([apiEndpoint, queryParams.toString()].join('?'));
        resolve(response.json());
      } catch (e) {
        reject(e);
      }
    });
  };
};
