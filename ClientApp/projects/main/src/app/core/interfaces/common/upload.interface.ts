import { UploadStatus } from '../../types';

/**
 * File upload progress interface
 */
export interface FileUpload {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  url?: string | null;
  error?: string | null;
}

/**
 * Upload result interface
 */
export interface UploadResult {
  success: boolean;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  error?: string;
}
