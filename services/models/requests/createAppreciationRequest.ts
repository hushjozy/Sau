export interface CreateAppreciationRequest {
  receiverEmail: string;
  points: number;
  message: string;
  isPublic: boolean;
}