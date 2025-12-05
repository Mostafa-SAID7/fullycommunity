import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, PodcastShow, EpisodeListItem, PodcastHost } from '../../../core/services/media/podcast.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';

@Component({
  selector: 'app-podcast-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PodcastLayoutComponent, EpisodeCardComponent],
  templateUrl: './podcast-detail.component.html'

})
export class PodcastDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);
  private authService = inject(AuthService);

  podcast: PodcastShow | null = null;
  episodes: EpisodeListItem[] = [];
  hosts: PodcastHost[] = [];
  loading = true;
  loadingEpisodes = false;
  isLoggedIn = false;
  isSubscribed = false;
  canEdit = false;
  sortBy = 'newest';
  page = 1;
  hasMoreEpisodes = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe(params => this.loadPodcast(params['slug']));
  }

  loadPodcast(slug: string) {
    this.loading = true;
    this.podcastService.getPodcastBySlug(slug).subscribe({
      next: podcast => {
        this.podcast = podcast;
        this.hosts = podcast.hosts || [];
        this.checkOwnership();
        this.loadEpisodes();
        if (this.isLoggedIn) this.checkSubscription();
        this.loading = false;
      },
      error: () => { this.podcast = null; this.loading = false; }
    });
  }

  checkOwnership() {
    const user = this.authService.currentUser();
    this.canEdit = !!user && ((user as any).roles?.includes('Admin') || this.podcast?.ownerId === user.id);
  }

  checkSubscription() {
    if (this.podcast) {
      this.podcastService.isSubscribed(this.podcast.id).subscribe(r => this.isSubscribed = r.isSubscribed);
    }
  }

  loadEpisodes() {
    if (!this.podcast) return;
    this.loadingEpisodes = true;
    this.page = 1;
    this.podcastService.getEpisodes(this.podcast.id, this.page, 20, this.sortBy).subscribe({
      next: result => {
        this.episodes = result.items;
        this.hasMoreEpisodes = result.page < result.totalPages;
        this.loadingEpisodes = false;
      },
      error: () => this.loadingEpisodes = false
    });
  }

  loadMoreEpisodes() {
    if (!this.podcast) return;
    this.page++;
    this.podcastService.getEpisodes(this.podcast.id, this.page, 20, this.sortBy).subscribe(result => {
      this.episodes = [...this.episodes, ...result.items];
      this.hasMoreEpisodes = result.page < result.totalPages;
    });
  }

  toggleSubscribe() {
    if (!this.podcast) return;
    if (this.isSubscribed) {
      this.podcastService.unsubscribe(this.podcast.id).subscribe(() => this.isSubscribed = false);
    } else {
      this.podcastService.subscribe(this.podcast.id).subscribe(() => this.isSubscribed = true);
    }
  }

  getCategoryName(): string {
    return this.podcast ? this.podcastService.getCategoryName(this.podcast.category) : '';
  }

  playEpisode(episode: EpisodeListItem) {
    window.location.href = '/podcasts/episode/' + episode.podcastShowId + '/' + episode.id;
  }

  share() {
    if (navigator.share) {
      navigator.share({ title: this.podcast?.title, url: window.location.href });
    }
  }
}
