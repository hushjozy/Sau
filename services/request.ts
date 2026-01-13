import { getItem, removeItem, saveItem } from "@lib/storage";
import { BASE_URL } from "@lib/utils";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  data: GenericResponse<T>;
  status: number;
  responseData?: GenericResponse<T>;
  requestSuccessful?: boolean;
  message?: string;
}

export interface GenericResponse<T = any> {
  status: number;
  message: string;
  data: T;
  requestSuccessful: boolean;
  responseData?: T;
}

type ApiError = AxiosError<ApiResponse>;

function logNetworkError(result: ApiError) {
  if (result.response) {
    let { response } = result;
    let { config, status, data } = response;
    logNetworkData(config, status, data);
  } else {
    if (__DEV__) {
      console.log(JSON.stringify(result, null, 4), " dev error", result);
    }
  }
}

function logNetworkData(
  config: AxiosRequestConfig<any>,
  status: number,
  data: any
) {
  if (__DEV__) {
    console.log(
      "\n====================>\n",
      JSON.stringify(config, null, 4),
      "\n====================>"
    );
    console.log(
      "\n<========== HTTP " + status + " ==========\n",
      JSON.stringify(data, null, 4),
      "\n<=============================="
    );
  }
}

function createApiClient() {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 seconds timeout
  });

  // ✅ FIXED: Request Interceptor - Attach Access Token
  instance.interceptors.request.use(
    async (config) => {

      if(config.url?.includes("Auth")){
        console.log("Auth URL detected, skipping token attachment.");
        await removeItem("accessToken");
      }
      else {
        const token = await getItem("accessToken", "string");
        // console.log("🔑 Request Token:", token ? "Token exists" : "No token");
        // console.log( "this is the token", token );
        
        // ✅ FIXED: Add token if it exists
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

      }


      
      console.log( "this is the config", config );

      console.log("📤 Request Config:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!config.headers.Authorization,
      });

      return config;
    },
    (error) => {
      console.error("❌ Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor - Handle 401 and Token Refresh
  instance.interceptors.response.use(
    (response) => {
      console.log("✅ Response Success:", {
        status: response.status,
        url: response.config.url,
      });
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      console.log("❌ Response Error:", {
        status: error.response?.status,
        url: originalRequest?.url,
        retry: originalRequest?._retry,
      });

      // Handle 401 Unauthorized - Attempt Token Refresh
      // if (error.response?.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;

      //   console.log("🔄 Attempting token refresh...");

      //   const refreshToken = getItem("refreshToken", "string");
      //   const accessToken = getItem("accessToken", "string");

      //   if (!refreshToken || !accessToken) {
      //     console.log("❌ No refresh token available, logging out...");
      //     removeItem("accessToken");
      //     removeItem("refreshToken");
      //     removeItem("user");
      //     return Promise.reject(error);
      //   }

      //   try {
      //     // ⚠️ UPDATE THIS ENDPOINT TO MATCH YOUR BACKEND
      //     // Common patterns:
      //     // - `${BASE_URL}Auth/RefreshToken`
      //     // - `${BASE_URL}Auth/refresh`
      //     // - `${BASE_URL}api/Auth/RefreshToken`
      //     const response = await axios.post(
      //       `${BASE_URL}Auth/RefreshToken`, // 👈 UPDATE THIS TO YOUR ACTUAL ENDPOINT
      //       { accessToken, refreshToken },
      //       {
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //       }
      //     );

      //     console.log("✅ Token refresh response:", response.status);

      //     if (response?.status === 200 && response.data) {
      //       // Handle different response structures
      //       const newAccessToken = 
      //         response.data.accessToken || 
      //         response.data.responseData?.accessToken ||
      //         response.data.data?.accessToken;
            
      //       const newRefreshToken = 
      //         response.data.refreshToken || 
      //         response.data.responseData?.refreshToken ||
      //         response.data.data?.refreshToken;

      //       if (newAccessToken) {
      //         console.log("✅ New tokens received, saving...");

      //         // Save new tokens
      //         saveItem("accessToken", newAccessToken);
      //         if (newRefreshToken) {
      //           saveItem("refreshToken", newRefreshToken);
      //         }

      //         // Update the Authorization header for the retry
      //         instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      //         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      //         console.log("🔄 Retrying original request with new token...");

      //         // Retry the original request
      //         return instance(originalRequest);
      //       }
      //     }

      //     // If refresh failed, clear tokens and logout
      //     console.log("❌ Token refresh failed, logging out...");
      //     removeItem("accessToken");
      //     removeItem("refreshToken");
      //     removeItem("user");
      //   } catch (refreshError) {
      //     console.error("❌ Token refresh error:", refreshError);
      //     removeItem("accessToken");
      //     removeItem("refreshToken");
      //     removeItem("user");
      //     return Promise.reject(refreshError);
      //   }
      // }

      return Promise.reject(error);
    }
  );

  return instance;
}

const apiClient = createApiClient();

export async function makeRequest<T = any>(
  config: AxiosRequestConfig,
  callback?: () => void
): Promise<ApiResponse<T>> {
  try {
    console.log("📡 Making request to:", config.url);
    const response: any = await apiClient(config);
    console.log("📥 Response received:", {
      status: response.status,
      url: config.url,
    });

    let { status, data } = response;
    logNetworkData(config, status, data);
    callback?.();

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as ApiError;
    logNetworkError(axiosError);
    console.log("❌ Raw error:", axiosError);
    callback?.();

    if (axiosError.response) {
      throw {
        error: axiosError.response.data,
        status: axiosError.response.status,
      };
    } else {
      throw {
        data: "An error occurred while making the request.",
        status: 500,
      };
    }
  }
}