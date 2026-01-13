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
import { PointTransactionDto } from "../models/pointTransactionDto";


export const getMyTransactions = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `PointTransactions/me?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: PointTransactionDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
export const getUserTransactions = async (
  userEmail: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `PointTransactions/user/${encodeURIComponent(userEmail)}?PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: PointTransactionDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};
