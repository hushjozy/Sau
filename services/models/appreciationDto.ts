export interface AppreciationDto {
  id?: number;
  receiverEmail: string;
  receiverFullName?: string;
  points: number;
  message: string;
  isPublic: boolean;
  isAnonymous: boolean;
  createdDate?: string;
  giverEMail?: string;
  giverFullName?: string;
}