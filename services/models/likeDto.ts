export interface LikeDto {
    id:            number;
    postReference: string;
    commentId:     number;
    likerName:     string;
    likerEmail:    string;
    likerPosition: string;
    likedAt:       Date;
    isOnPost:      boolean;
}
