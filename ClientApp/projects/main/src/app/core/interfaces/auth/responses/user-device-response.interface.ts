/**
 * User device response interface
 */
export interface UserDeviceResponse {
  id: string;
  deviceId: string;
  deviceName: string | null;
  deviceType: string | null;
  platform: string | null;
  isTrusted: boolean;
  lastSeenAt: string;
}
