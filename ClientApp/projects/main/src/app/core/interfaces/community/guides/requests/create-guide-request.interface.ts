import { GuideType, GuideDifficulty } from '../enums';

export interface CreateGuideRequest {
  title: string;
  description: string | null;
  type: GuideType;
  difficulty: GuideDifficulty;
  estimatedMinutes: number | null;
  categoryId?: string | null;
  tags?: string[];
  coverImageUrl?: string | null;
  carMake?: string | null;
  carModel?: string | null;
  carYearFrom?: number | null;
  carYearTo?: number | null;
}
