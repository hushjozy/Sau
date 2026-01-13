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
import { NominationDto, ReceiverNominationResponse } from "../models/nomination";
import { CreateNominationRequestVm } from "../models/requests/createNominationRequestVm";



export const getTotalApprovedAwardPointsMe = async () => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Nominations/total-approved-awardpoints/me`,
  };

  const response = await makeRequest<{
    responseData: number;
  }>(config);

  return response.data;
};

export const getNominationsByReceiverEmail = async (
  email: string,
  page: number = 1,
  pageSize: number = 20
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Nominations/receiver/${encodeURIComponent(email)}?PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: ReceiverNominationResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};

export const submitNomination = async (payload: CreateNominationRequestVm) => {
  
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `Nominations`,
    data: payload,
  };

  const response = await makeRequest<{
    responseData: NominationDto;
    requestSuccessful: boolean;
    responseCode: string;
    message: string;
  }>(config);

  console.log("Create Nomination Response:", response.data);

  if (!response.data?.requestSuccessful) {
    throw new Error(response.data?.message || "Failed to save post");
  }

  return response.data.responseData;
};

export const getSubmittedNominations = async (
  page: number = 1,
  pageSize: number = 20
) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `Nominations/submitted?PageNumber=${page}&PageSize=${pageSize}`,
  };

  const response = await makeRequest<{
    responseData: NominationDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>(config);

  return response.data;
};



