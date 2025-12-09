export interface CreateGuideStepRequest {
  stepNumber: number;
  title: string;
  content: string;
  tip?: string | null;
  warning?: string | null;
  toolsRequired?: string | null;
  partsRequired?: string | null;
  estimatedMinutes?: number | null;
}
