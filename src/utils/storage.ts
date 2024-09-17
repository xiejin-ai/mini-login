


import { ISafeAny } from '../typings';



function formatKey(key: string): string {
  return `system_${key}`.toUpperCase();
}

export function getItem(key: string): ISafeAny {
  const str = localStorage.getItem(formatKey(key)) as string;
  try {
    return JSON.parse(str);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch ( e ) {
    return null;
  }
}

export function setItem(key: string, data: ISafeAny) {
  localStorage.setItem(formatKey(key), JSON.stringify(data));
}

function remoteItem(key: string) {
  localStorage.removeItem(formatKey(key));
}

const $storage = {
  
  get token() {
    return getItem('token') || '';
  },
  set token(data: string) {
    setItem('token', data);
  },
  get refreshToken() {
    return getItem('refresh_token') || '';
  },
  set refreshToken(data: string) {
    setItem('refresh_token', data);
  },

  get rememberedUsername(){
    return getItem('rememberedUsername') || '';
  },
  
  set rememberedUsername(data: string | null) {
      setItem('rememberedUsername', data);
  },

  
 
  clear() {
    remoteItem('token');
    remoteItem('refresh_token');
 
  },
  isAuthorized () {
  return !this.refreshToken && !this.token;
  }
};



export { $storage };
