import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";
import { IUser } from "@services/models/users";
import { User } from "../models/userProfile";
import { UpdateProfileVm } from "../models/requests/updateProfileVm";
import { IMG_URL } from "@/lib/utils";

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
    profile: IUser;
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

export const getAllUsers = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `User?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
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

export const searchByKeywords = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `User/search-by-keywords?search=${searchTerm}&pageNumber=${page}&pageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: searchUsersResponse;
    requestSuccessful: boolean;
    responseCode: string;
    
  }>(config);
  
  
  console.log("Search Users Response:", response.data.responseData);
  return response.data.responseData;
};

export interface searchUsersResponse {
    pageSize: number;
    pageNumber: number;
    data: IUser[];
    pageCount: number;

  }
export const getCurrentUser = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `User/me`,
  };

  const response = await makeRequest<{
    responseData: User;
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  return response;
};
export const getUserPoints = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `User/me/points`,
  };

  const response = await makeRequest<{
    responseData: number;
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  return response;
};

export const updateProfile = async (payload: UpdateProfileVm) => {
  
  const config: AxiosRequestConfig = {
    method: "PUT",
    url: `User/me/profile`,
    data: payload, 
  };

  const response = await makeRequest<{
    responseData: any;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to save comment");
  }

  return response.data.responseData;
};

export const getProfileImage = async (imageUrl: string) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
    return imageUrl;
  }
  return IMG_URL.imgUrl + imageUrl;

}

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);                    
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `User/upload-profile-p`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await makeRequest<{ imageUrl: string }>(config);

  return response.data;
};
