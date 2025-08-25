import { Constants } from "@/lib/constants";
import { Endpoints } from "@/lib/endpoints";
import FailureResponse from "@/lib/services/response/FailureResponse";
import SuccessResponse from "@/lib/services/response/SuccessResponse";
import { logout } from "@/lib/utils";
import axios, { type AxiosInstance, AxiosError } from "axios";
class AxiosService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<(token: string) => void> = [];
  

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    this.addInterceptors();
  }

  /**
   * Add request and response interceptors
   */
  private addInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem(Constants.API_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => this.handleResponse(response), // Handle success responses
      async (error) => {
        if (error.response?.status === 401) {
          return this.handle401Error(error);
        }
        
        // Xử lý các lỗi HTTP khác (400, 500, etc.)
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 400) {
            // Log để debug
            console.log("Handling 400 error:", { status, data });
            console.log("Full error response:", error.response);
            
            // Để axios xử lý error gốc, không tạo FailureResponse
            // Component sẽ xử lý error.response.data.message trực tiếp
          }
          
          if (status >= 500) {
            // Tạo FailureResponse cho lỗi server
            const failureResponse = new FailureResponse({
              code: status.toString(),
              message: data?.message || "Internal Server Error",
              success: false,
            });
            return Promise.reject(failureResponse);
          }
        }
        
        return Promise.reject(error);
      },
    );
  }

  /**
   * Handle responses with specific status codes
   */
  private handleResponse(response: any) {
    switch (response.status) {
      case 200: {
        const successResponse = new SuccessResponse("Success", response.data);
        if (!successResponse.data.success) {
          return Promise.reject(successResponse);
        }
        return successResponse;
      }

      case 400: {
        // Đảm bảo message lỗi từ backend được truyền đúng cách
        const errorMessage = response.data?.message || "Request failed.";
        const failureResponse = new FailureResponse({
          code: response.status.toString(),
          message: errorMessage,
          success: false,
        });
        return Promise.reject(failureResponse);
      }

      default: {
        return response;
      }
    }
  }

  /**
   * Handle 401 Unauthorized errors
   */
  private async handle401Error(error: AxiosError) {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(this.instance(originalRequest));
        });
      });
    }

    this.isRefreshing = true;
    const refreshToken = localStorage.getItem(Constants.API_REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      this.handleLogout();
      return Promise.reject(error);
    }

    try {
      const { data } = await this.instance.post(Endpoints.Auth.REFRESH, {
        refreshToken,
      });
      const newToken = data.accessToken;
      localStorage.setItem(Constants.API_TOKEN_KEY, newToken);

      // Resolve all queued requests with the new token
      this.refreshQueue.forEach((callback) => callback(newToken));
      this.refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return this.instance(originalRequest);
    } catch (refreshError) {
      this.handleLogout();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle logout by clearing tokens and redirecting to login
   */
  private handleLogout() {
    logout();
  }

  /**
   * Create a new AbortSignal for request cancellation
   */
  public createAbortSignal(): AbortSignal {
    return new AbortController().signal;
  }

  /**
   * Get Axios instance
   */
  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

const axiosService = new AxiosService();
export default axiosService;
