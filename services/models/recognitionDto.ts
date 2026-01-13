export interface RecognitionRequest {
  recipientAppUserId: string;
  recipientFullName: string;
  recipientEmail: string;
  giverAppUserId: string;
  giverFullName: string;
  giverEmail: string;
  awardId: number;
  message: string;
}

export interface RecognitionResponse {
  id: number;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  isDeleted: boolean;
  recipientAppUserId: string;
  recipientFullName: string;
  recipientEmail: string;
  giverAppUserId: string;
  giverFullName: string;
  giverEmail: string;
  awardId: number;
  awardImageUrl: string;
  message: string;
  date: string;
}

export interface RecognitionListResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  requestSuccessful: boolean;
  responseData: RecognitionResponse[];
  responseCode: string;
}