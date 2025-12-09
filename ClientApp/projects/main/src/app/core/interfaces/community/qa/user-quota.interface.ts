/**
 * User Quota DTO - matches UserQuotaDto.cs from backend
 */
export interface UserQuota {
  questionsUsed: number;
  questionsLimit: number;
  hasUnlimitedQuestions: boolean;
  questionsRemaining: number;
  answersUsed: number;
  answersLimit: number;
  hasUnlimitedAnswers: boolean;
  answersRemaining: number;
  userRole: string;
}
