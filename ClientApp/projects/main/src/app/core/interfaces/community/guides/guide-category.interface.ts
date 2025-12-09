// Interface matching backend DTO: GuideCategoryDto

export interface GuideCategory {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  parentId: string | null;
}
