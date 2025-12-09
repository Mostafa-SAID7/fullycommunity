/**
 * Hot questions from Q&A
 */
export interface HotQuestion {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  answerCount: number;
  voteCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  bountyPoints: number | null;
  tags: string[];
  createdAt: string;
}
