import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PodcastService, Podcast, Episode } from '../../../core/services/podcast.service';
import { AuthService } from '../../../core/services/auth.service';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';

@Component({
  selector: 'app-podcast-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PodcastLayoutComponent, EpisodeCardComponent],
  template: `
    <app-podcast-layout [canEdit]="canEdit">
      @if (podcast) {
        <div class="podcast-detail">
          <!-- Header -->
          <div class="podcast-header">
            <img [src]="podcast.coverImageUrl || '/assets/podcast-default.png'" [alt]="podcast.title" class="cover" />
            <div class="info">
              <h1>{{ podcast.title }}</h1>
              <a [routerLink]="['/channels', podcast.channelId]" class="channel">{{ podcast.channelName }}</a>
              <div class="stats">
                <span>⭐ {{ podcast.averageRating | number:'1.1-1' }}</span>
                <span>{{ podcast.subscriberCount | number }} subscribers</span>
                <span>{{ podcast.episodeCount }} episodes</span>
              </div>
              <p class="description">{{ podcast.description }}</p>
              <div class="actions">
                @if (isLoggedIn) {
                  <button (click)="toggleSubscribe()" [class.subscribed]="isSubscribed" class="btn-subscribe">
                    {{ isSubscribed ? '✓ Subscribed' : '+ Subscribe' }}
                  </button>
                } @else {
                  <a routerLink="/login" class="btn-subscribe">Sign in to Subscribe</a>
                }
                <button (click)="share()" class="btn-secondary">Share</button>
                @if (canEdit) {
                  <a [routerLink]="['/podcasts/manage', podcast.id]" class="btn-secondary">Manage</a>
                }
              </div>
            </div>
          </div>

          <!-- Episodes -->
          <div class="episodes-section">
            <div class="section-header">
              <h2>Episodes</h2>
              <select [(ngModel)]="sortBy" (change)="loadEpisodes()">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div class="episode-list">
              @for (episode of episodes; track episode.id) {
                <app-episode-card 
                  [episode]="episode" 
                  (onPlay)="playEpisode($event)"
                  (onAddToQueue)="addToQueue($event)"
                  (onSave)="saveEpisode($event)"
                />
              }
            </div>
            @if (hasMoreEpisodes) {
              <button (click)="loadMoreEpisodes()" class="load-more">Load More Episodes</button>
            }
          </div>
        </div>
      } @else {
        <div class="loading">Loading podcast...</div>
      }
    </app-podcast-layout>
  `,
  styles: [`
    .podcast-header { display: flex; gap: 2rem; margin-bottom: 3rem; }
    .cover { width: 250px; height: 250px; border-radius: 16px; object-fit: cover; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .info { flex: 1; }
    .info h1 { font-size: 2rem; margin: 0 0 0.5rem; }
    .channel { color: #6366f1; text-decoration: none; font-size: 1.1rem; }
    .stats { display: flex; gap: 1.5rem; margin: 1rem 0; color: #666; }
    .description { color: #444; line-height: 1.6; margin-bottom: 1.5rem; }
    .actions { display: flex; gap: 1rem; }
    .btn-subscribe {
      padding: 0.75rem 1.5rem; background: #6366f1; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none;
    }
    .btn-subscribe.subscribed { background: #10b981; }
    .btn-secondary {
      padding: 0.75rem 1.5rem; background: white; color: #333;
      border: 1px solid #ddd; border-radius: 8px; cursor: pointer; text-decoration: none;
    }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-header h2 { margin: 0; }
    .section-header select { padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 6px; }
    .episode-list { display: flex; flex-direction: column; gap: 1rem; }
    .load-more {
      display: block; margin: 2rem auto; padding: 0.75rem 2rem;
      background: white; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;
    }
    .loading { text-align: center; padding: 3rem; color: #666; }
  `]
})
export class PodcastDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private podcastService = inject(PodcastService);
  private authService = inject(AuthService);

  podcast: Podcast | null = null;
  episodes: Episode[] = [];
  isLoggedIn = false;
  isSubscribed = false;
  canEdit = false;
  sortBy = 'newest';
  page = 1;
  hasMoreEpisodes = false;

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadPodcast(slug);
    });
  }

  loadPodcast(slug: string) {
    this.podcastService.getPodcastBySlug(slug).subscribe(podcast => {
      this.podcast = podcast;
      this.checkOwnership();
      this.loadEpisodes();
      if (this.isLoggedIn) this.checkSubscription();
    });
  }

  checkOwnership() {
    const user = this.authService.currentUser();
    // Check if user owns this podcast or is admin
    this.canEdit = !!user && ((user as any).roles?.includes('Admin') || (this.podcast as any)?.ownerId === user.id);
  }

  checkSubscription() {
    if (this.podcast) {
      this.podcastService.isSubscribed(this.podcast.id).subscribe(r => this.isSubscribed = r.isSubscribed);
    }
  }

  loadEpisodes() {
    if (!this.podcast) return;
    this.page = 1;
    this.podcastService.getEpisodes(this.podcast.id, this.page, 20).subscribe(result => {
      this.episodes = result.items;
      this.hasMoreEpisodes = result.page < result.totalPages;
    });
  }

  loadMoreEpisodes() {
    if (!this.podcast) return;
    this.page++;
    this.podcastService.getEpisodes(this.podcast.id, this.page, 20).subscribe(result => {
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

  playEpisode(episode: Episode) { console.log('Play', episode); }
  addToQueue(episode: Episode) { this.podcastService.addToQueue(episode.id).subscribe(); }
  saveEpisode(episode: Episode) { this.podcastService.saveEpisode(episode.id).subscribe(); }
  share() { navigator.share?.({ title: this.podcast?.title, url: window.location.href }); }
}
