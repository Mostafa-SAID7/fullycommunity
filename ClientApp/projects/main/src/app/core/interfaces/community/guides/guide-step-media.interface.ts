// Interface matching backend DTO: GuideStepMediaDto

export interface GuideStepMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  sortOrder: number;
}
