/**
 * Video Processing Response Interfaces
 * Processing and media related response interfaces
 */

import { VideoQuality } from '../enums/video-enums';

export interface VideoProcessingResponse {
  videoId: string;
  processingId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  estimatedTimeRemaining?: number;
  currentStep: string;
  steps: {
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    startedAt?: string;
    completedAt?: string;
    error?: string;
  }[];
  results?: {
    thumbnails?: string[];
    qualities?: VideoQuality[];
    subtitles?: string[];
    transcription?: string;
    contentWarnings?: any[];
  };
}

export interface VideoThumbnailResponse {
  videoId: string;
  thumbnails: {
    id: string;
    url: string;
    type: 'auto' | 'custom' | 'generated';
    timestamp?: number;
    isDefault: boolean;
    createdAt: string;
  }[];
  defaultThumbnail: string;
}

export interface VideoSubtitleResponse {
  videoId: string;
  subtitles: {
    id: string;
    language: string;
    languageName: string;
    url: string;
    format: 'srt' | 'vtt' | 'ass';
    type: 'uploaded' | 'auto_generated';
    accuracy?: number;
    createdAt: string;
  }[];
}

export interface VideoTranscriptionResponse {
  videoId: string;
  transcription: {
    id: string;
    language: string;
    text: string;
    format: 'txt' | 'json' | 'srt';
    accuracy: number;
    timestamps: boolean;
    speakerLabels: boolean;
    createdAt: string;
  };
  segments?: {
    start: number;
    end: number;
    text: string;
    speaker?: string;
    confidence: number;
  }[];
}

export interface VideoMonetizationResponse {
  videoId: string;
  monetization: {
    enabled: boolean;
    type: string;
    revenue: {
      total: number;
      ads: number;
      sponsorship: number;
      donations: number;
      subscription: number;
    };
    metrics: {
      cpm: number;
      rpm: number;
      fillRate: number;
      clickThroughRate: number;
    };
    settings: any;
  };
  eligibility: {
    eligible: boolean;
    reasons?: string[];
    requirements?: {
      name: string;
      met: boolean;
      description: string;
    }[];
  };
}