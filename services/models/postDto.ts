export interface PostDto {
    reference:          string;
    isAppreciationPost: boolean;
    viewType:           string;
    senderName:         string;
    senderEmail:        string;
    senderFunction:     string;
    awardId:            number;
    awardImageUrl:      string;
    message:            string;
    likeCount:          number;
    commentCount:       number;
    mediaFiles:         MediaFile[];
    id:                 number;
    isActive:           boolean;
    createdDate:        Date;
    createdBy:          string;
    isDeleted:          boolean;
}

export interface MediaFile {
    mediaUrl:  string;
    mediaType: string;
}
