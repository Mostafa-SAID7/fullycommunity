/**
 * Record Play Request
 */
export interface RecordPlayRequest {
  sessionId: string | null;
  deviceType: string | null;
  platform: string | null;
  source: string | null;
}

/**
 * Listen Progress Request
 */
export interface ListenProgressRequest {
  currentPosition: string; // TimeSpan
  listenDuration: string; // TimeSpan
  listenPercent: number;
  isCompleted: boolean;
}
