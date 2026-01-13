import { AxiosRequestConfig } from "axios";
import { makeRequest } from "../request";
import { IUser } from "@services/models/users";
import { PostDto } from "../models/postDto";
import { CommentDto } from "../models/commentDto";
import { LikeDto } from "../models/likeDto";
import { SaveCommentVm } from "../models/requests/saveCommentVm";
import { SaveLikeVm } from "../models/requests/saveLikeVm";
import { RecognitionListResponse, RecognitionResponse } from "../models/recognitionDto";
import { AddRecognitionVm } from "../models/requests/addRecognitionVm";


export const addRecognition = async (payload: AddRecognitionVm) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Recognitions`,
    data: payload,
  };

  const response = await makeRequest<{
    responseData: RecognitionResponse[];
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

export const getCurrentUserRecognitions = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Recognitions/CurrentUserRecognitions?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: RecognitionListResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getAllRecognitions = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Recognitions/all?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: RecognitionListResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getRecognitionsByReceiver = async (
  email: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Recognitions/receiver/${email}?PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: RecognitionResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getRecognitionsByGiver = async (
  email: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Recognitions/giver/${email}?PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: RecognitionResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getRecognitionsByDateRange = async (
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Recognitions/daterange?startDate=${startDate}&endDate=${endDate}&PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: RecognitionResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};


