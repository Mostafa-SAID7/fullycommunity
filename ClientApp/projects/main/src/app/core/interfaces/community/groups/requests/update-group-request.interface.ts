import { GroupPrivacy } from '../enums';

export interface UpdateGroupRequest {
  name?: string;
  description?: string | null;
  privacy?: GroupPrivacy;
  coverImageUrl?: string | null;
  rules?: string | null;
}
