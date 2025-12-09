// Interface matching backend DTO: ReviewMediaDto

export interface ReviewMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
}
