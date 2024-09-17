// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ISafeAny = any;

export interface IResponse<T=ISafeAny> {
  status: number;
  data: T;
  error?: string;
  message?: string;
}