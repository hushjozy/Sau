export interface CreateNominationRequestVm {
  awardId: number;
  nomineeEmail: string;
  justification: string;
  isPublic: boolean;
}