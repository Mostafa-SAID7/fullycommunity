import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastService, Podcast, Episode } from '../../../core/services/podcast.service';
import { PodcastLayoutComponent } from '../shared/podcast-layout/podcast-layout.component';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';

@Component({
  selector: 'app-podcast-library',
  standalone: true,
  imports: [CommonModule, PodcastLayoutComponent, PodcastCardComponent, EpisodeCardComponent],
  template: `
    <app-podcast-layout>
      <div class="library-page">
        <h1>Your Library</h1>
        
        <!-- Tabs -->
        <div class="tabs">
          <button [class.active]="activeTab === 'subscriptions'" (click)="activeTab = 'subscriptions'">
            Subscriptions
          </button>
          <button [class.active]="activeTab === 'saved'" (click)="activeTab = 'saved'; loadSaved()">
            Saved Episodes
          </button>
          <button [class.active]="activeTab === 'history'" (click)="activeTab = 'history'; loadHistory()">
            History
          </button>
          <button [class.active]="activeTab === 'queue'" (click)="activeTab = 'queue'; loadQueue()">
            Queue
          </button>
        </div>

        <!-- Subscriptions -->
        @if (activeTab === 'subscriptions') {
          <div class="section">
            @if (subscriptions.length === 0) {
              <div class="empty">
                <p>You haven't subscribed to any podcasts yet.</p>
                <a routerLink="/podcasts/browse" class="btn">Browse Podcasts</a>
              </div>
            } @else {
              <div class="podcast-grid">
                @for (podcast of subscriptions; track podcast.id) {
                  <app-podcast-card [podcast]="podcast" />
                }
              </div>
            }
          </div>
        }

        <!-- Saved Episodes -->
        @if (activeTab === 'saved') {
          <div class="section">
            @if (savedEpisodes.length === 0) {
              <div class="empty">No saved episodes yet.</div>
            } @else {
              <div class="episode-list">
                @for (episode of savedEpisodes; track episode.id) {
                  <app-episode-card [episode]="episode" />
                }
              </div>
            }
          </div>
        }

        <!-- History -->
        @if (activeTab === 'history') {
          <div class="section">
            <div class="section-header">
              <span></span>
              <button (click)="clearHistory()" class="btn-text">Clear History</button>
            </div>
            @if (history.length === 0) {
              <div class="empty">No listening history yet.</div>
            } @else {
              <div class="episode-list">
                @for (item of history; track item.episodeId) {
                  <div class="history-item">
                    <app-episode-card [episode]="item" [showProgress]="true" [progress]="item.progressPercent" />
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Queue -->
        @if (activeTab === 'queue') {
          <div class="section">
            <div class="section-header">
              <span>{{ queue.length }} episodes</span>
              <button (click)="clearQueue()" class="btn-text">Clear Queue</button>
            </div>
            @if (queue.length === 0) {
              <div class="empty">Your queue is empty.</div>
            } @else {
              <div class="episode-list">
                @for (item of queue; track item.episodeId; let i = $index) {
                  <div class="queue-item">
                    <span class="queue-number">{{ i + 1 }}</span>
                    <app-episode-card [episode]="item" />
                    <button (click)="removeFromQueue(item.episodeId)" class="btn-remove">✕</button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </app-podcast-layout>
  `,
  styles: [`
    .library-page h1 { margin-bottom: 1.5rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; }
    .tabs button {
      padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer;
      font-size: 1rem; color: #666; border-radius: 8px 8px 0 0;
    }
    .tabs button.active { background: #6366f1; color: white; }
    .section-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .btn-text { background: none; border: none; color: #6366f1; cursor: pointer; }
    .podcast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .episode-list { display: flex; flex-direction: column; gap: 1rem; }
    .empty { text-align: center; padding: 3rem; color: #666; }
    .empty .btn { display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border-radius: 8px; text-decoration: none; }
    .queue-item { display: flex; align-items: center; gap: 1rem; }
    .queue-number { font-size: 1.25rem; font-weight: bold; color: #999; width: 30px; }
    .btn-remove { background: none; border: none; color: #999; cursor: pointer; font-size: 1.25rem; }
  `]
})
export class PodcastLibraryComponent implements OnInit {
  private podcastService = inject(PodcastService);

  activeTab = 'subscriptions';
  subscriptions: Podcast[] = [];
  savedEpisodes: Episode[] = [];
  history: any[] = [];
  queue: any[] = [];

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.podcastService.getSubscriptions(1, 50).subscribe(r => this.subscriptions = r.items);
  }

  loadSaved() {
    this.podcastService.getSavedEpisodes(1, 50).subscribe(r => this.savedEpisodes = r.items);
  }

  loadHistory() {
    this.podcastService.getHistory(1, 50).subscribe(r => this.history = r.items);
  }

  loadQueue() {
    this.podcastService.getQueue().subscribe(q => this.queue = q);
  }

  clearHistory() {
    // API call to clear history
    this.history = [];
  }

  clearQueue() {
    // API call to clear queue
    this.queue = [];
  }

  removeFromQueue(episodeId: string) {
    this.podcastService.removeFromQueue(episodeId).subscribe(() => {
      this.queue = this.queue.filter(q => q.episodeId !== episodeId);
    });
  }
}
