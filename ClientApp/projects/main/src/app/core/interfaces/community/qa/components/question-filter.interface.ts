import { BaseFilter } from '../../../../types';
import { QuestionStatus } from '../enums';

export interface QuestionFilter extends BaseFilter {
  status?: QuestionStatus;
  categoryId?: string;
  tag?: string;
  authorId?: string;
  hasAcceptedAnswer?: boolean;
  hasBounty?: boolean;
  minAnswers?: number;
}
