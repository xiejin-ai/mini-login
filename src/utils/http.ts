import { message as antMessage } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {  cloneDeep, get, isNumber, isString } from 'lodash-es';
import { $storage } from './storage';
import { ISafeAny } from '../typings';



function toParams(params: { [key: string]: string | number | string[] | number[] | boolean }) {
  const str = Object.keys(params)
    .filter((key) => !!params[key] || params[key] === 0 || params[key] === false)
    .map(function (key) {
      if (Array.isArray(params[key])) {
        return (params[key] as (number | string)[])
          .map((item) => {
            return key + '=' + encodeURIComponent(item?.toString() ?? '');
          })
          .join('&');
      }
      return key + '=' + encodeURIComponent(params[key]?.toString() ?? '');
    })
    .join('&');
  return str;
}


function createHttpClient() {
  const client = axios.create({
    timeout: 1000 * 60 * 10,
    headers: {},
    baseURL: '/'
  });

  client.interceptors.request.use((config) => {
  
    const conf = cloneDeep(config);

    conf.headers.set('Cache-Control', 'no-cache');
    conf.headers.set('Pragma', 'no-cache');
    conf.headers.set('X-IDPS-From', 'browser');
    conf.headers.set('X-Content-Type-Options', 'nosniff');
    conf.headers.set('X-Xss-Protection', '1;mode=block');
    conf.headers.set('Content-Security-Policy', 'default-src "self"');

    const token = $storage.token;
    if (token) {
      conf.headers.set('Authorization', `Bearer ${token}`);
    }
    return conf;
  });

  // 刷新标记
  let isRefreshing = false;
  // 重试队列
  let retryRequests: (() => void)[] = [];

  client.interceptors.response.use(
    (response: AxiosResponse) => {
  
      const { data, config } = response;
      const { url, method } = config || {};
      const { code, status, message, errors } = data || {};
     
      const statusError = isNumber(status) && ![200, 201, 0].includes(status);
     
    
      if (statusError && status !== 0) {
        const _res = {
          url,
          code,
          method,
          message,
          errors
        };
        const msg = message || get(errors, 'message', '');
        if (msg && isString(msg)) {
          antMessage.error(msg);
        }
        return Promise.reject(_res);
      }
      
      return response;
    },
    (error: AxiosError) => {
      async function refreshToken() {
        if (!isRefreshing) {
          isRefreshing = true;
          return axios
            .post('api/auth/refresh', null, {
              headers: {
                Authorization: `Bearer ${$storage.token}`,
                'Refresh-Token': $storage.refreshToken
              }
            })
            .then((res) => {
              const { accessToken } = res.data.data;
              $storage.token = accessToken;
              retryRequests.forEach((cb) => cb());
              retryRequests = [];
              return client(error.config as ISafeAny);
            })
            .catch((error) => {
              $storage.clear();
              if ([430].includes(error.response?.status)) {
                window.location.href = '/login';
              }
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        return new Promise((resolve) => {
          retryRequests.push(() => {
            resolve(client(error.config as ISafeAny));
          });
        });
      }
     
      if ([401, 430].find((s) => s === error.response?.status)) {
        if (!$storage.isAuthorized()) {
          $storage.clear();
          return;
        }
        if (error.config?.url?.includes('api/auth/logout')) {
          return;
        }
        return refreshToken();
      }
      if ([403].find((s) => s === error.response?.status)) {
        
          window.location.href = '/exception?code=403';
        
      }

      const msg = get(error, 'response.data.message', '');
      if (msg) {
        antMessage.error(msg);
      }

      if ([500, 502].find((s) => s === error.response?.status) && !msg) {
        antMessage.error('服务器错误，请稍后再试');
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );
  return client;
}

const $http = createHttpClient();

export { $http, toParams };

export function refreshToken() {
  return axios
    .post('api/auth/refresh', null, {
      headers: {
        Authorization: `Bearer ${$storage.token}`,
        'Refresh-Token': $storage.refreshToken
      }
    })
    .then((res) => {
      const { accessToken } = res.data.data;
      $storage.token =accessToken;
    });
}
