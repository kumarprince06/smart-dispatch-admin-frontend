export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status: number;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
