export interface AddRecognitionVm {
    recipientAppUserIds: string[];
    recipientFullNames:  string[];
    recipientEmails:     string[];
    giverAppUserId:      string;
    giverFullName:       string;
    giverEmail:          string;
    awardId:             number;
    message:             string;
}
