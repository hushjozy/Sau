import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";
import { IUser } from "@services/models/users";
import { PostDto } from "../models/postDto";
import { CommentDto } from "../models/commentDto";
import { LikeDto } from "../models/likeDto";
import { SaveCommentVm } from "../models/requests/saveCommentVm";
import { SaveLikeVm } from "../models/requests/saveLikeVm";


export const savePost = async (formData: FormData) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Buzz/SavePost`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await makeRequest<{
    responseData: PostDto;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

  console.log("Save Post Response:", response.data);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to save post");
  }

  return response.data.responseData;
};

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

  return response.data;
};

export const getComments = async (reference: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Buzz/GetCommentsOfPost/${encodeURIComponent(reference)}`,
  };

  const response = await makeRequest<{
    responseData: CommentDto[];
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  return response;
};

export const saveComment = async (payload: SaveCommentVm) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Buzz/saveComment`,
    data: payload, // Send payload directly, not wrapped in { request: ... }
  };

  const response = await makeRequest<{
    responseData: CommentDto;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to save comment");
  }

  return response.data.responseData;
};

export const saveLike = async (payload: SaveLikeVm) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Buzz/saveLike`,
    data: payload, // Send payload directly, not wrapped in { request: ... }
  };

  const response = await makeRequest<{
    responseData: LikeDto;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to save like");
  }

  return response.data.responseData;
};

export const getLikes = async (reference: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Buzz/GetLikesOfPost/${encodeURIComponent(reference)}`,
  };

  const response = await makeRequest<{
    responseData: LikeDto[];
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  return response;
};

export const unlike = async (id: number, isOnPost: boolean) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `Buzz/Unlike/${id}/${isOnPost}`,
  };

  const response = await makeRequest<{
    responseData: LikeDto;
    requestSuccessful: boolean;
    responseCode: string;
  }>(config);
  return response;
};

