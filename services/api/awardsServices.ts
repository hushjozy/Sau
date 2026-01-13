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
import { AwardDto } from "../models/awardDto";
import { IMG_URL } from "@/lib/utils";


export const getAllAwards = async (
  search: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const searchTerm = !!search ? search : "@";
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Awards/all?PageNumber=${page}&PageSize=${pageSize}&searchTerm=${searchTerm}`,
  };

  const response = await makeRequest<{
    responseData: AwardDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

export const getAwards = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Awards`,
  };

  const response = await makeRequest<{
    responseData: AwardDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

export const getAward = async (id: number) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Awards/${id}`,
  };

  const response = await makeRequest<{
    responseData: AwardDto;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

export const getAwardImagePath = async (imageUrl: string) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
    return imageUrl;
  }
  return IMG_URL.imgUrl + imageUrl;

}

