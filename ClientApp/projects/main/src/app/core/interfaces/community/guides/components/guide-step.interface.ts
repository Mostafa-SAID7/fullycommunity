// Interface matching backend DTO: GuideStepDto

export interface GuideStep {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  tip: string | null;
  warning: string | null;
  toolsRequired: string | null;
  partsRequired: string | null;
  estimatedMinutes: number | null;
  mediaUrls: string[];
}
