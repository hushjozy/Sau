export interface PointTransactionDto {
    id: number;
    appUserId: string;
    amount: number;
    transactionType: string;
    sourceEntityId: string;
    sourceEntityType: string;
    description: string;
    appUserFullName: string;
    appUserEmail: string;
    isActive: boolean;
    createdDate: string;
    createdBy: string;
    isDeleted: boolean;
}