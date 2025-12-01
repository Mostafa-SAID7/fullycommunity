import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PodcastService, Podcast, Episode } from '../../../core/services/podcast.service';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';

@Component({
  selector: 'app-podcast-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PodcastCardComponent, EpisodeCardComponent, PodcastLayoutComponent],
  template: `
    <app-podcast-layout [canEdit]="canEdit">
      <!-- Not logged in - Show login prompt -->
      @if (!isLoggedIn) {
        <section class="hero-section">
          <div class="hero-content">
            <h1>Discover Amazing Podcasts</h1>
            <p>Listen to the best automotive podcasts, car reviews, and expert discussions.</p>
            <div class="hero-actions">
              <a routerLink="/login" class="btn btn-primary">Sign In</a>
              <a routerLink="/register" class="btn btn-secondary">Create Account</a>
            </div>
          </div>
          <div class="hero-features">
            <div class="feature">
              <span class="icon">🎧</span>
              <h3>Unlimited Listening</h3>
              <p>Access thousands of episodes</p>
            </div>
            <div class="feature">
              <span class="icon">📱</span>
              <h3>Listen Anywhere</h3>
              <p>Web, mobile, and offline</p>
            </div>
            <div class="feature">
              <span class="icon">🚗</span>
              <h3>Car Community</h3>
              <p>Connect with enthusiasts</p>
            </div>
          </div>
        </section>

        <!-- Trending for guests -->
        <section class="section">
          <div class="section-header">
            <h2>Trending Podcasts</h2>
            <a routerLink="/podcasts/browse" class="see-all">See All</a>
          </div>
          <div class="podcast-grid">
            @for (podcast of trendingPodcasts; track podcast.id) {
              <app-podcast-card [podcast]="podcast" />
            }
          </div>
        </section>
      }

      <!-- Logged in - Show personalized content -->
      @if (isLoggedIn) {
        <!-- Continue Listening -->
        @if (continueListening.length > 0) {
          <section class="section">
            <div class="section-header">
              <h2>Continue Listening</h2>
              <a routerLink="/podcasts/library" class="see-all">View History</a>
            </div>
            <div class="episode-list">
              @for (episode of continueListening; track episode.id) {
                <app-episode-card [episode]="episode" [showProgress]="true" />
              }
            </div>
          </section>
        }

        <!-- Your Subscriptions -->
        @if (subscriptions.length > 0) {
          <section class="section">
            <div class="section-header">
              <h2>Your Subscriptions</h2>
              <a routerLink="/podcasts/library" class="see-all">Manage</a>
            </div>
            <div class="podcast-scroll">
              @for (podcast of subscriptions; track podcast.id) {
                <app-podcast-card [podcast]="podcast" [compact]="true" />
              }
            </div>
          </section>
        }

        <!-- New Episodes from Subscriptions -->
        @if (newEpisodes.length > 0) {
          <section class="section">
            <div class="section-header">
              <h2>New Episodes</h2>
            </div>
            <div class="episode-list">
              @for (episode of newEpisodes; track episode.id) {
                <app-episode-card [episode]="episode" />
              }
            </div>
          </section>
        }

        <!-- Recommended for You -->
        <section class="section">
          <div class="section-header">
            <h2>Recommended for You</h2>
            <a routerLink="/podcasts/browse" class="see-all">Explore</a>
          </div>
          <div class="podcast-grid">
            @for (podcast of recommendedPodcasts; track podcast.id) {
              <app-podcast-card [podcast]="podcast" />
            }
          </div>
        </section>

        <!-- Trending -->
        <section class="section">
          <div class="section-header">
            <h2>Trending Now</h2>
          </div>
          <div class="podcast-grid">
            @for (podcast of trendingPodcasts; track podcast.id) {
              <app-podcast-card [podcast]="podcast" />
            }
          </div>
        </section>
      }
    </app-podcast-layout>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 4rem 2rem;
      border-radius: 16px;
      margin-bottom: 2rem;
      text-align: center;
    }
    .hero-content h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .hero-content p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
    .btn { padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .btn-primary { background: #6366f1; color: white; }
    .btn-secondary { background: transparent; border: 2px solid white; color: white; }
    .hero-features { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
    .feature { text-align: center; padding: 1rem; }
    .feature .icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .feature h3 { margin-bottom: 0.25rem; }
    .feature p { opacity: 0.8; font-size: 0.9rem; }

    .section { margin-bottom: 2rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .section-header h2 { font-size: 1.5rem; margin: 0; }
    .see-all { color: #6366f1; text-decoration: none; font-weight: 500; }

    .podcast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .podcast-scroll { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; }
    .episode-list { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class PodcastHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private podcastService = inject(PodcastService);

  isLoggedIn = false;
  canEdit = false;
  trendingPodcasts: Podcast[] = [];
  recommendedPodcasts: Podcast[] = [];
  subscriptions: Podcast[] = [];
  newEpisodes: Episode[] = [];
  continueListening: any[] = [];

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.canEdit = this.checkEditPermission();
    this.loadData();
  }

  private checkEditPermission(): boolean {
    const user = this.authService.currentUser();
    // Check if user has admin or editor role
    return !!user && (user as any).roles?.includes('Admin');
  }

  private loadData() {
    // Load trending for everyone
    this.podcastService.getTrendingPodcasts(8).subscribe(podcasts => {
      this.trendingPodcasts = podcasts;
    });

    if (this.isLoggedIn) {
      // Load personalized content
      this.podcastService.getRecommendedPodcasts(8).subscribe(podcasts => {
        this.recommendedPodcasts = podcasts;
      });

      this.podcastService.getSubscriptions(1, 10).subscribe(result => {
        this.subscriptions = result.items;
      });

      this.podcastService.getHistory(1, 5).subscribe(result => {
        this.continueListening = result.items.filter((h: any) => !h.isCompleted);
      });

      this.podcastService.getLatestEpisodes(1, 10).subscribe(result => {
        this.newEpisodes = result.items;
      });
    }
  }
}
