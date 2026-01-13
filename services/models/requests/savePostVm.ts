export interface SavePostVm {
  senderName: string;
  senderEmail: string;
  senderFunction: string;
  message: string;
  mentions: string[];
  viewType: string;
  mediaFiles?: File[] | any[];
  mediaType?: string;
}