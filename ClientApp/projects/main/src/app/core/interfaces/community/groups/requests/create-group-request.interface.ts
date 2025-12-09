import { GroupPrivacy, GroupType } from '../enums';

export interface CreateGroupRequest {
  name: string;
  description: string | null;
  privacy: GroupPrivacy;
  type: GroupType;
  categoryId?: string | null;
  coverImageUrl?: string | null;
  rules?: string | null;
}
