export interface LocationReview {
    id: string;
    locationId: string;
    authorId: string;
    authorName: string;
    authorAvatarUrl?: string;
    rating: number;
    title?: string;
    content: string;
    photos: string[];
    ownerResponse?: string;
    createdAt: Date;
    updatedAt?: Date;
}
