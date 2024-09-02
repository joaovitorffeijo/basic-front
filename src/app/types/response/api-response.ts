export interface APIResponse<T> {
  status: number;
  message: string;
  result: T;
}