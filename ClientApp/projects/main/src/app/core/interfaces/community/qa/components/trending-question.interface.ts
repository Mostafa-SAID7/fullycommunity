
export interface TrendingQuestion {
    id: string;
    title: string;
    slug: string | null;
    viewCount: number;
    answerCount: number;
    createdAt: string;
}
