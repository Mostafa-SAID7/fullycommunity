import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PodcastService, PodcastListItem, EpisodeListItem, ListenHistory, QueueItem } from '../../../core/services/media/podcast.service';
import { PodcastLayoutComponent } from '../podcast-layout/podcast-layout.component';
import { PodcastCardComponent } from '../shared/podcast-card/podcast-card.component';
import { EpisodeCardComponent } from '../shared/episode-card/episode-card.component';

@Component({
  selector: 'app-podcast-library',
  standalone: true,
  imports: [CommonModule, RouterLink, PodcastLayoutComponent, PodcastCardComponent, EpisodeCardComponent],
  template: `
    <app-podcast-layout>
      <div class="library-page">
        <h1>Your Library</h1>
        
        <div class="tabs">
          <button [class.active]="activeTab === 'subscriptions'" (click)="setTab('subscriptions')">
            Subscriptions
          </button>
          <button [class.active]="activeTab === 'saved'" (click)="setTab('saved')">
            Saved Episodes
          </button>
          <button [class.active]="activeTab === 'history'" (click)="setTab('history')">
            History
          </button>
          <button [class.active]="activeTab === 'queue'" (click)="setTab('queue')">
            Queue
          </button>
        </div>

        @if (activeTab === 'subscriptions') {
          <div class="section">
            @if (loadingSubscriptions) {
              <div class="loading">Loading subscriptions...</div>
            } @else if (subscriptions.length === 0) {
              <div class="empty">
                <span class="empty-icon">📻</span>
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

        @if (activeTab === 'saved') {
          <div class="section">
            @if (loadingSaved) {
              <div class="loading">Loading saved episodes...</div>
            } @else if (savedEpisodes.length === 0) {
              <div class="empty">
                <span class="empty-icon">🔖</span>
                <p>No saved episodes yet.</p>
              </div>
            } @else {
              <div class="episode-list">
                @for (episode of savedEpisodes; track episode.id) {
                  <app-episode-card [episode]="episode" (onPlay)="playEpisode($event)" />
                }
              </div>
            }
          </div>
        }

        @if (activeTab === 'history') {
          <div class="section">
            <div class="section-header">
              <span></span>
              @if (history.length > 0) {
                <button (click)="clearHistory()" class="btn-text">Clear History</button>
              }
            </div>
            @if (loadingHistory) {
              <div class="loading">Loading history...</div>
            } @else if (history.length === 0) {
              <div class="empty">
                <span class="empty-icon">📜</span>
                <p>No listening history yet.</p>
              </div>
            } @else {
              <div class="episode-list">
                @for (item of history; track item.episodeId) {
                  <div class="history-item">
                    <app-episode-card 
                      [episode]="item.episode" 
                      [showProgress]="true" 
                      [progress]="item.listenPercent"
                      (onPlay)="playEpisode(item.episode)" 
                    />
                    @if (item.isCompleted) {
                      <span class="completed-badge">✓ Completed</span>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        @if (activeTab === 'queue') {
          <div class="section">
            <div class="section-header">
              <span>{{ queue.length }} episodes in queue</span>
              @if (queue.length > 0) {
                <button (click)="clearQueue()" class="btn-text">Clear Queue</button>
              }
            </div>
            @if (loadingQueue) {
              <div class="loading">Loading queue...</div>
            } @else if (queue.length === 0) {
              <div class="empty">
                <span class="empty-icon">📋</span>
                <p>Your queue is empty.</p>
              </div>
            } @else {
              <div class="episode-list">
                @for (item of queue; track item.episodeId; let i = $index) {
                  <div class="queue-item">
                    <span class="queue-number">{{ i + 1 }}</span>
                    <app-episode-card [episode]="item.episode" [compact]="true" (onPlay)="playEpisode(item.episode)" />
                    <button (click)="removeFromQueue(item.episodeId)" class="btn-remove" title="Remove">✕</button>
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
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; flex-wrap: wrap; }
    .tabs button {
      padding: 0.75rem 1.5rem; border: none; background: none; cursor: pointer;
      font-size: 1rem; color: #666; border-radius: 8px 8px 0 0; transition: all 0.2s;
    }
    .tabs button:hover { background: #f5f5f5; }
    .tabs button.active { background: #6366f1; color: white; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .btn-text { background: none; border: none; color: #6366f1; cursor: pointer; font-size: 0.9rem; }
    .btn-text:hover { text-decoration: underline; }
    .podcast-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .episode-list { display: flex; flex-direction: column; gap: 1rem; }
    .loading { text-align: center; padding: 2rem; color: #666; }
    .empty { text-align: center; padding: 4rem; background: #f8f9fa; border-radius: 16px; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
    .empty p { color: #666; margin-bottom: 1rem; }
    .empty .btn { 
      display: inline-block; padding: 0.75rem 1.5rem; background: #6366f1; 
      color: white; border-radius: 8px; text-decoration: none; 
    }
    .history-item { position: relative; }
    .completed-badge {
      position: absolute; top: 1rem; right: 1rem;
      background: #10b981; color: white; padding: 4px 8px;
      border-radius: 4px; font-size: 0.75rem; font-weight: 600;
    }
    .queue-item { display: flex; align-items: center; gap: 1rem; }
    .queue-number { font-size: 1.25rem; font-weight: bold; color: #999; width: 30px; text-align: center; }
    .btn-remove { 
      background: none; border: none; color: #999; cursor: pointer; 
      font-size: 1.25rem; padding: 0.5rem; transition: color 0.2s;
    }
    .btn-remove:hover { color: #ef4444; }
  `]
})
export class PodcastLibraryComponent implements OnInit {
  private podcastService = inject(PodcastService);

  activeTab = 'subscriptions';
  subscriptions: PodcastListItem[] = [];
  savedEpisodes: EpisodeListItem[] = [];
  history: ListenHistory[] = [];
  queue: QueueItem[] = [];

  loadingSubscriptions = false;
  loadingSaved = false;
  loadingHistory = false;
  loadingQueue = false;

  ngOnInit() {
    this.loadSubscriptions();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'subscriptions': this.loadSubscriptions(); break;
      case 'saved': this.loadSaved(); break;
      case 'history': this.loadHistory(); break;
      case 'queue': this.loadQueue(); break;
    }
  }

  loadSubscriptions() {
    if (this.subscriptions.length > 0) return;
    this.loadingSubscriptions = true;
    this.podcastService.getSubscriptions(1, 50).subscribe({
      next: r => { this.subscriptions = r.items; this.loadingSubscriptions = false; },
      error: () => this.loadingSubscriptions = false
    });
  }

  loadSaved() {
    if (this.savedEpisodes.length > 0) return;
    this.loadingSaved = true;
    this.podcastService.getSavedEpisodes(1, 50).subscribe({
      next: r => { this.savedEpisodes = r.items; this.loadingSaved = false; },
      error: () => this.loadingSaved = false
    });
  }

  loadHistory() {
    this.loadingHistory = true;
    this.podcastService.getHistory(1, 50).subscribe({
      next: r => { this.history = r.items; this.loadingHistory = false; },
      error: () => this.loadingHistory = false
    });
  }

  loadQueue() {
    this.loadingQueue = true;
    this.podcastService.getQueue().subscribe({
      next: q => { this.queue = q; this.loadingQueue = false; },
      error: () => this.loadingQueue = false
    });
  }

  clearHistory() {
    this.podcastService.clearHistory().subscribe(() => this.history = []);
  }

  clearQueue() {
    this.podcastService.clearQueue().subscribe(() => this.queue = []);
  }

  removeFromQueue(episodeId: string) {
    this.podcastService.removeFromQueue(episodeId).subscribe(() => {
      this.queue = this.queue.filter(q => q.episodeId !== episodeId);
    });
  }

  playEpisode(episode: EpisodeListItem) {
    window.location.href = '/podcasts/episode/' + episode.podcastShowId + '/' + episode.id;
  }
}
