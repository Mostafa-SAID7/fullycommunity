import { BaseFilter } from '../../../../types';
import { LocationType, LocationStatus } from '../enums';

export interface LocationFilter extends BaseFilter {
  type?: LocationType;
  status?: LocationStatus;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  isVerified?: boolean;
}
