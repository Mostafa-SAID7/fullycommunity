// Interface matching backend DTO: NewsCategoryDto

export interface NewsCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  iconUrl: string | null;
}
