export interface ApiError {
  code: string;
  message: string;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}
