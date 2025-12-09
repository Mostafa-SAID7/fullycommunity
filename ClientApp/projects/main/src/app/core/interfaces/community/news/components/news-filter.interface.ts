import { BaseFilter } from '../../../../types';
import { NewsStatus } from '../enums';

export interface NewsFilter extends BaseFilter {
  status?: NewsStatus;
  categoryId?: string;
  tag?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
}
