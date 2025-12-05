import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ExpertDashboard {
  totalAnswers: number;
  acceptedAnswers: number;
  helpfulVotes: number;
  rating: number;
  questionsAnsweredThisWeek: number;
  recentQuestions: RecentQuestion[];
}

export interface ReviewerDashboard {
  totalReviews: number;
  helpfulVotes: number;
  averageRating: number;
  reviewsThisMonth: number;
  recentReviews: RecentReview[];
}

export interface ContentCreatorDashboard {
  totalContent: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followersCount: number;
  breakdown: ContentBreakdown;
  recentContent: RecentContent[];
}

export interface ContentBreakdown {
  posts: number;
  guides: number;
  videos: number;
  podcasts: number;
}

export interface RecentQuestion {
  id: string;
  title: string;
  createdAt: string;
  answerCount: number;
}

export interface RecentReview {
  id: string;
  title: string;
  rating: number;
  createdAt: string;
  helpfulCount: number;
}

export interface RecentContent {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

export interface UserDashboardOverview {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    accountStatus: number;
    verificationStatus: number;
  };
  activity: {
    postsCreated: number;
    questionsAsked: number;
    reviewsWritten: number;
    commentsPosted: number;
  };
  engagement: {
    groupsMembership: number;
    eventsAttending: number;
    followersCount: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getExpertDashboard(): Observable<ExpertDashboard> {
    return this.http.get<ExpertDashboard>(`${this.apiUrl}/expert`);
  }

  getReviewerDashboard(): Observable<ReviewerDashboard> {
    return this.http.get<ReviewerDashboard>(`${this.apiUrl}/reviewer`);
  }

  getContentCreatorDashboard(): Observable<ContentCreatorDashboard> {
    return this.http.get<ContentCreatorDashboard>(`${this.apiUrl}/content-creator`);
  }

  getUserDashboard(): Observable<UserDashboardOverview> {
    return this.http.get<UserDashboardOverview>(`${this.apiUrl}/overview`);
  }
}
