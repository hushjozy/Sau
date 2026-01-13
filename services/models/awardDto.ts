export interface AwardDto {
  id: number;
  isActive: boolean;
  createdDate: string;
  createdBy?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  isDeleted: boolean;
  name: string;
  isGlobal: boolean;
  allowedUserEmail: string;
  description: string;
  pointsAwarded: number;
  imageUrl: string;
  category: string;
  budgetId?: number;
}