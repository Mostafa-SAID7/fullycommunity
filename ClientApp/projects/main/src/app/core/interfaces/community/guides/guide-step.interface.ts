// Interface matching backend DTO: GuideStepDto
import { GuideStepMedia } from './guide-step-media.interface';

export interface GuideStep {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  media: GuideStepMedia[];
  tip: string | null;
  warning: string | null;
  toolsRequired: string | null;
  partsRequired: string | null;
  estimatedMinutes: number | null;
}
