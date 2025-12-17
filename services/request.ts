import { getItem, removeItem, saveItem } from "@lib/storage";
import { BASE_URL } from "@lib/utils";
import { useUser } from "@provider/UserProvider";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { json } from "zod";

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
    // console.log(
    //   "\n<========== HTTP " + status + " ==========\n",
    //   JSON.stringify(data, null, 4),
    //   "\n<=============================="
    // );
  }
}

function createApiClient() {
  const instance = axios.create({
    baseURL: BASE_URL,
    // timeout: 10000, // Set your desired timeout
  });

  instance.interceptors.request.use((config) => {
    removeItem("accessToken");
    const token = getItem("accessToken", "string");
    console.log("request token ln 59", JSON.stringify(token));
    if (!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("request config ln 62", config);
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        console.log("pull refresh");

        originalRequest._retry = true;
        const refreshToken = getItem("refreshToken", "string");
        const accessToken = getItem("accessToken", "string");

        const response = await axios.post(
          `${BASE_URL}Users/refresh-token`,
          { accessToken, refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              // Accept: "application/json",
            },
          }
        );
          console.log("error message ", response);
        if (response?.status === 200) {
          console.log("new refresh and token", response.data);

          const newToken = response.data.data.accessToken;
          saveItem("accessToken", newToken);
          saveItem("refreshToken", response.data.data.refreshToken);

          // Update the Authorization header for the failed request and retry it
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          return apiClient(originalRequest);
        } else {
          removeItem("accessToken");
          removeItem("refreshToken");
          removeItem("user");
        }
      }
      // if (error.response.status === 401 && !originalRequest._retry) {
      //   removeItem("accessToken");
      //   removeItem("refreshToken");
      //   removeItem("user");
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
    console.log("making request to ", config);
    const response: any = await apiClient(config);
    console.log("getting response  ", response);

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
    console.log(" raw error:", axiosError);
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
