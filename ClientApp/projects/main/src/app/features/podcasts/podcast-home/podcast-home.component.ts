import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PodcastService, PodcastListItem, EpisodeListItem, ListenHistory } from '../../../core/services/media/podcast.service';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';

@Component({
  selector: 'app-podcast-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PodcastCardComponent, EpisodeCardComponent, PodcastLayoutComponent],
  templateUrl: './podcast-home.component.html'
})
export class PodcastHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private podcastService = inject(PodcastService);

  loading = true;
  isLoggedIn = false;
  trendingPodcasts: PodcastListItem[] = [];
  recommendedPodcasts: PodcastListItem[] = [];
  subscriptions: PodcastListItem[] = [];
  latestEpisodes: EpisodeListItem[] = [];
  continueListening: ListenHistory[] = [];

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Load trending for everyone
    this.podcastService.getTrendingPodcasts(8).subscribe({
      next: podcasts => {
        this.trendingPodcasts = podcasts;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    // Load latest episodes
    this.podcastService.getLatestEpisodes(1, 10).subscribe({
      next: result => this.latestEpisodes = result.items,
      error: () => {}
    });

    if (this.isLoggedIn) {
      // Load personalized content
      this.podcastService.getRecommendedPodcasts(8).subscribe({
        next: podcasts => this.recommendedPodcasts = podcasts,
        error: () => {}
      });

      this.podcastService.getSubscriptions(1, 10).subscribe({
        next: result => this.subscriptions = result.items,
        error: () => {}
      });

      this.podcastService.getHistory(1, 5).subscribe({
        next: result => {
          this.continueListening = result.items.filter(h => !h.isCompleted);
        },
        error: () => {}
      });
    }
  }

  playEpisode(episode: EpisodeListItem) {
    this.podcastService.currentEpisode.set(episode as any);
    // Navigate to player or trigger mini player
    window.location.href = `/podcasts/episode/${episode.podcastShowId}/${episode.id}`;
  }

  // TrackBy functions for performance
  trackByPodcastId(index: number, podcast: PodcastListItem): string {
    return podcast.id;
  }

  trackByEpisodeId(index: number, episode: EpisodeListItem): string {
    return episode.id;
  }

  trackByHistoryId(index: number, item: ListenHistory): string {
    return item.episodeId;
  }
}
