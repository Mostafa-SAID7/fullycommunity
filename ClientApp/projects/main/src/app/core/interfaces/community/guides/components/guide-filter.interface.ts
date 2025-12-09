import { BaseFilter } from '../../../../types';
import { GuideType, GuideDifficulty } from '../enums';

export interface GuideFilter extends BaseFilter {
  type?: GuideType;
  difficulty?: GuideDifficulty;
  categoryId?: string;
  carMake?: string;
  carModel?: string;
  tag?: string;
  minRating?: number;
}
