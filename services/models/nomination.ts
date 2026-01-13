export interface ReceiverNomination {
  awardId: number;
  nominatorAppUserId: string;
  nomineeAppUserId: string;
  justification: string;
  status: string;
  approverAppUserId: string;
  approvedRejectedDate: string;
  isPublic: boolean;
  awardName: string;
  awardPoints: number;
  awardImageUrl: string;
  nominatorFullName: string;
  nominatorEmail: string;
  nomineeFullName: string;
  nomineeEmail: string;
  nomineeProfilePicture: string;
  nomineePosition: string;
  approverFullName: string;
  approverEmail: string;
  firstLevelApproverEmail: string;
  secondLevelApproverEmail: string;
  thirdLevelApproverEmail: string;
  id: number;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  isDeleted: boolean;
}

export interface ReceiverNominationResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  requestSuccessful: boolean;
  responseData: ReceiverNomination[];
  responseCode: string;
}

export interface NominationDto {
  nominationId?: number;
  id: number;
  awardId: number;
  nomineeEmail: string;
  nomineeFullName?: string;
  nominatorFullName?: string;
  justification: string;
  isPublic: boolean;
  status?: string;
  points?: number;
  reason?: string;
  createdAt?: string;
  nominatorEmail?: string;
}