/**
 * Enable 2FA response interface
 */
export interface Enable2FaResponse {
  sharedKey: string;
  qrCodeBase64: string;
  manualEntryKey: string;
}
