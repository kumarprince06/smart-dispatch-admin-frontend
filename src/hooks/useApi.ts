import { useState, useCallback } from 'react';
import apiClient from '../api/client';
import { type AxiosRequestConfig, type AxiosError } from 'axios';
import { type ApiResponse, type ApiError } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const request = useCallback(
    async <R = T>(
      config: AxiosRequestConfig,
      onSuccess?: (data: R) => void,
      onError?: (error: ApiError) => void
    ): Promise<ApiResponse<R> | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await apiClient.request<ApiResponse<R>>(config);
        const responseData = response.data;
        
        setState({
          data: responseData.data as unknown as T,
          isLoading: false,
          error: null,
        });

        if (onSuccess) onSuccess(responseData.data);
        return responseData;
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse<any>>;
        const apiError: ApiError = {
          message: axiosError.response?.data?.message || axiosError.message || 'An unexpected error occurred.',
          status: axiosError.response?.status,
        };

        setState({
          data: null,
          isLoading: false,
          error: apiError,
        });

        if (onError) onError(apiError);
        return null;
      }
    },
    [] // stable reference — never changes
  );

  // Each convenience method is individually memoized so it has a stable
  // identity across renders. Components that list these in useEffect deps
  // will NOT re-run the effect unless the hook itself is re-instantiated.
  const get = useCallback(
    <R = T>(url: string, config?: AxiosRequestConfig) =>
      request<R>({ ...config, method: 'GET', url }),
    [request]
  );

  const post = useCallback(
    <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<R>({ ...config, method: 'POST', url, data }),
    [request]
  );

  const put = useCallback(
    <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<R>({ ...config, method: 'PUT', url, data }),
    [request]
  );

  const patch = useCallback(
    <R = T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<R>({ ...config, method: 'PATCH', url, data }),
    [request]
  );

  const del = useCallback(
    <R = T>(url: string, config?: AxiosRequestConfig) =>
      request<R>({ ...config, method: 'DELETE', url }),
    [request]
  );

  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}
