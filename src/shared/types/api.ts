export interface ApiErrorResponse {
  isSuccessful: false;
  message: string;
  statusCode: number;
  meta?: Record<string, unknown>;
}

export interface ApiSuccessResponse<T> {
  isSuccessful: true;
  data: T;
  message?: string;
  statusCode: number;
}

export type SafeExecuteResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Meta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
}

export type SafePaginatedResponse<T> =
  | { isSuccessful: true; result: PaginatedResponse<T>; message?: string }
  | ApiErrorResponse;
