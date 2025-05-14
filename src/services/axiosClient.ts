import axios, { AxiosError, AxiosHeaders, AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import { HTTPStatusCode } from '../enums/status';

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface AxiosRequest {
  method: Method;
  baseURL?: string;
  path?: string;
  params?: Record<string, string | number | boolean | undefined | Array<any>>;
  data?: Record<string, string | number | boolean | any>;
  headers?: RawAxiosRequestHeaders;
}

class AxiosClientService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://localhost:3000/',
      headers: new AxiosHeaders({
        'Content-Type': 'application/json',
      }),
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add any pre-request logic here, like adding authentication tokens
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.instance.interceptors.response.use((response) => response.data, this.handleErrorResponse);
  }

  private handleErrorResponse = (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case HTTPStatusCode.BAD_REQUEST:
          console.error('Bad Request:', error.response.data);
          break;
        case HTTPStatusCode.UNAUTHORIZED:
          // Handle unauthorized access, e.g., logout user, redirect to login
          console.error('Unauthorized Access');
          break;
        case HTTPStatusCode.FORBIDDEN:
          console.error('Forbidden Access');
          break;
        case HTTPStatusCode.NOT_FOUND:
          console.error('Resource Not Found');
          break;
        case HTTPStatusCode.INTERNAL_SERVER_ERROR:
          console.error('Internal Server Error');
          break;
        default:
          console.error('Unhandled Error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  };

  async request<T = any>(config: AxiosRequest): Promise<T> {
    const { method, path = '', params, data, headers, baseURL } = config;

    // Create a new AxiosHeaders instance
    const requestHeaders = new AxiosHeaders(this.instance.defaults.headers);

    // Merge custom headers
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        requestHeaders.set(key, value);
      });
    }

    try {
      return await this.instance.request<T, T>({
        method,
        url: path,
        params,
        data,
        headers: requestHeaders,
        baseURL: baseURL || this.instance.defaults.baseURL,
      });
    } catch (error) {
      // Additional error handling or logging can be added here
      throw error;
    }
  }
}

export default new AxiosClientService();