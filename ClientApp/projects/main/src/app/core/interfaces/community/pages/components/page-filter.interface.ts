import { BaseFilter } from '../../../../types';
import { PageCategory, PageType } from '../enums';

export interface PageFilter extends BaseFilter {
  category?: PageCategory;
  type?: PageType;
  isVerified?: boolean;
  city?: string;
  country?: string;
}
