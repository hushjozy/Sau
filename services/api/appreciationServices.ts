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
import { CreateAppreciationRequest } from "../models/requests/createAppreciationRequest";
import { AppreciationDto } from "../models/appreciationDto";


export const giverAppreciation = async (payload: CreateAppreciationRequest) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Appreciations`,
    data: payload,
  };

  const response = await makeRequest<{
    responseData: AppreciationDto;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

    console.log("Appreciation Response:", response.data);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to give appreciation");
  }

  return response.data.responseData;
};

export const getGivenAppreciations = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Appreciations/given?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: AppreciationDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getReceivedAppreciations = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Appreciations/received?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: AppreciationDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getBuzzAppreciations = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Appreciations/buzz?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: AppreciationDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

