export interface SaveCommentVm {
    commenterEmail:   string;
    commenterName:    string;
    content:          string;
    commentReference: string;
    postReference:    string;
    isOnPost:         boolean;
    mentions:         string[];
}
