import { BaseFilter } from '../../../../types';
import { GroupType, GroupPrivacy } from '../enums';

export interface GroupFilter extends BaseFilter {
  type?: GroupType;
  privacy?: GroupPrivacy;
  categoryId?: string;
}
