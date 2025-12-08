export interface QAStats {
  totalQuestions: number;
  totalAnswers: number;
  openQuestions: number;
  answeredQuestions: number;
  closedQuestions: number;
  questionsToday: number;
  questionsThisWeek: number;
  answersToday: number;
  answersThisWeek: number;
  totalCategories: number;
  totalVotes: number;
}

export interface QuestionListItem {
  id: string;
  title: string;
  content: string;
  status: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  voteCount: number;
  answerCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface QuestionDetail extends QuestionListItem {
  answers: AnswerItem[];
}

export interface AnswerItem {
  id: string;
  content: string;
  isAccepted: boolean;
  voteCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  questionCount: number;
}

export interface TagItem {
  tag: string;
  count: number;
  lastUsed: string;
}

export interface QuestionsResponse {
  success: boolean;
  data: {
    items: QuestionListItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface TagsResponse {
  success: boolean;
  data: {
    items: TagItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface TrendsResponse {
  success: boolean;
  data: {
    dailyStats: DailyStat[];
    topTags: TopTag[];
    topCategories: TopCategory[];
  };
}

export interface DailyStat {
  date: string;
  questions: number;
  answers: number;
}

export interface TopTag {
  tag: string;
  count: number;
}

export interface TopCategory {
  category: string;
  count: number;
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    topContributors: any[];
    topAnswerers: any[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
