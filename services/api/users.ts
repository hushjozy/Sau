import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";
import { IUser } from "@services/models/users";

// export const login = async (body: { email: string }) => {
//   const config: AxiosRequestConfig = {
//     method: "GET",
//     url: `Auth/GetLoginCode/${body.email}`,
//     data: body,
//   };

//   const response = await makeRequest<Partial<boolean>>(config);

//   return response.data;
// };

export const login = async (email: string) => {
  console.log(email, "in the emailservice");
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Auth/GetLoginCode/${encodeURIComponent(email)}`,
  };

  const response = await makeRequest<Partial<boolean>>(config);
  console.log(response, "after call");
  return response;
};


export const validateOtp = async (body: { otp: string }) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Auth/ValidateLoginCode/${body.otp}`,
    data: body,
  };

  const response = await makeRequest<{
    accessToken: string;
    refreshToken: string;
  }>(config);
  console.log(response);

  return response.data;
};

export const me = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "Users/me",
  };

  const response = await makeRequest<IUser>(config);

  return response.data;
};

export const getUsers = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Users?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    employees: IUser[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

export const uploadImage = async (body: FormData, userId: string) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Users/${userId}/upload`,
    data: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await makeRequest<{ imageUrl: string }>(config);

  return response.data;
};
