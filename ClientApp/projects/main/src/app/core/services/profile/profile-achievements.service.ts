import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Achievement,
  UserLevel,
  XPActivity,
  LeaderboardEntry,
  LeaderboardType
} from '../../interfaces/profile/profile-achievements.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileAchievementsService {
  private readonly apiUrl = `${environment.apiUrl}/profile/achievements`;

  constructor(private http: HttpClient) {}

  /**
   * Get user achievements
   */
  getAchievements(userId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(userId: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`${this.apiUrl}/${userId}/unlocked`);
  }

  /**
   * Get achievement progress
   */
  getAchievementProgress(achievementId: string): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.apiUrl}/progress/${achievementId}`);
  }

  /**
   * Get user level
   */
  getUserLevel(userId: string): Observable<UserLevel> {
    return this.http.get<UserLevel>(`${this.apiUrl}/${userId}/level`);
  }

  /**
   * Get XP history
   */
  getXPHistory(page: number = 1, pageSize: number = 20): Observable<XPActivity[]> {
    return this.http.get<XPActivity[]>(`${this.apiUrl}/xp-history`, {
      params: {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    });
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(type: LeaderboardType, category?: string, limit: number = 100): Observable<LeaderboardEntry[]> {
    let params = new HttpParams();
    params = params.set('type', type.toString());
    params = params.set('limit', limit.toString());
    if (category) params = params.set('category', category);
    
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/leaderboard`, { params });
  }

  /**
   * Get user rank
   */
  getUserRank(userId: string, type: LeaderboardType): Observable<LeaderboardEntry> {
    return this.http.get<LeaderboardEntry>(`${this.apiUrl}/${userId}/rank`, {
      params: { type: type.toString() }
    });
  }
}
