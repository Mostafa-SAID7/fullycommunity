/**
 * Reporting and Flagging Enums
 * Enums related to content reporting and flagging
 */

export enum FlagReason {
  Spam = 0,
  Harassment = 1,
  HateSpeech = 2,
  Violence = 3,
  SexualContent = 4,
  Copyright = 5,
  Misinformation = 6,
  Other = 7
}

export enum FlagStatus {
  Pending = 0,
  Reviewed = 1,
  Dismissed = 2,
  Upheld = 3
}

export enum ReportType {
  Content = 0,
  User = 1,
  Copyright = 2,
  Technical = 3
}

export enum ReportStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3,
  Escalated = 4
}

export enum ReportPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}