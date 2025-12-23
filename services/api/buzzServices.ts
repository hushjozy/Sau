import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";
import { IUser } from "@services/models/users";
import { PostDto } from "../models/postDto";
import { CommentDto } from "../models/commentDto";





// export const validateOtp = async (body: { otp: string }) => {
//   const config: AxiosRequestConfig = {
//     method: "POST",
//     url: `Auth/ValidateLoginCode/${body.otp}`,
//     data: body,
//   };

//   const response = await makeRequest<{
//     accessToken: string;
//     refreshToken: string;
//     profile: IUser;
//   }>(config);
//   console.log(response);

//   return response.data;
// };

// export const me = async () => {
//   const config: AxiosRequestConfig = {
//     method: "GET",
//     url: "Users/me",
//   };

//   const response = await makeRequest<IUser>(config);

//   return response.data;
// };

export const getPosts = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Buzz/GetPosts?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: PostDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  // console.log(response, "getPosts response");
  return response.data;
};

export const getComments = async (reference: string) => {
  // console.log(email, "in the emailservice");
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Buzz/GetCommentsOfPost/${encodeURIComponent(reference)}`,
  };

  const response = await makeRequest<{
    responseData: CommentDto[];
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  console.log(response, "after call");
  return response;
};

// export const uploadImage = async (body: FormData, userId: string) => {
//   const config: AxiosRequestConfig = {
//     method: "POST",
//     url: `Users/${userId}/upload`,
//     data: body,
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   };

//   const response = await makeRequest<{ imageUrl: string }>(config);

//   return response.data;
// };
