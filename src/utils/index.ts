import { ISafeAny } from '../typings';

export * from './http';
export * from './storage';


export const getIsMobile = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod|android/.test(ua);
}

export const validatePasswordStrength = (_:ISafeAny, value:string) => {
  if (!value) {
    return Promise.reject(new Error('Please input your password!'));
  }
  // 检查密码强度: 至少8个字符，包含大写字母、小写字母和数字
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!strongPasswordRegex.test(value)) {
    return Promise.reject(new Error('至少8个字符，包含大写字母、小写字母和数字'));
  }
  return Promise.resolve();
};