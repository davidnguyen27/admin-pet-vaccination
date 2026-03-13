export interface IResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface IPaginatedResponse<T> extends IResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IResponseError {
  statusCode: number;
  errors: string[];
  timestamp?: string;
  method?: string;
  path?: string;
}
