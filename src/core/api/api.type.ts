export interface I_Params {
  page: number;
  limit: number;
  search?: string | null;
}

export interface I_Response<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface I_PaginatedResponse<T> extends I_Response<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface I_ErrorResponse {
  statusCode: number;
  errors: string[];
  timestamp?: string;
  method?: string;
  path?: string;
}
