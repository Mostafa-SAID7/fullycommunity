/**
 * Video Media Request Interfaces
 * Media processing related request interfaces (thumbnails, subtitles, transcription)
 */

export interface VideoThumbnailRequest {
  videoId: string;
  thumbnailFile?: File;
  timestamp?: number; // For auto-generated thumbnail
  customText?: string;
  overlaySettings?: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    fontSize: number;
    color: string;
  };
}

export interface VideoSubtitleRequest {
  videoId: string;
  language: string;
  subtitleFile?: File;
  autoGenerate?: boolean;
  format?: 'srt' | 'vtt' | 'ass';
}

export interface VideoTranscriptionRequest {
  videoId: string;
  language?: string;
  includeTimestamps?: boolean;
  includeSpeakerLabels?: boolean;
  format?: 'txt' | 'json' | 'srt';
}