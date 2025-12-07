/**
 * Backward compatibility export
 * This file maintains the old import path for existing components
 * 
 * @deprecated Import from './qa/qa.service' or './qa' instead
 */

// Re-export the main service
export { QAService } from './qa/qa.service';
export { QuestionService } from './qa/question.service';
export { AnswerService } from './qa/answer.service';
export { TrendingService } from './qa/trending.service';

// Re-export all interfaces
export * from '../../interfaces/community/qa';
