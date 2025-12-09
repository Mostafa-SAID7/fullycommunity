/**
 * Send OTP request interface
 */
export interface SendOtpRequest {
  purpose: string;
  channel?: 'email' | 'sms';
}
