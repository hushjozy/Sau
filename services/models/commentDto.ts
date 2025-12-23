export interface CommentDto {
    postReference:  string;
    reference:      string;
    commenterName:  string;
    commenterEmail: string;
    content:        string;
    likeCount:      number;
    commentCount:   number;
    isOnPost:       boolean;
    id:             number;
    isActive:       boolean;
    createdDate:    Date;
    createdBy:      string;
    isDeleted:      boolean;
}
