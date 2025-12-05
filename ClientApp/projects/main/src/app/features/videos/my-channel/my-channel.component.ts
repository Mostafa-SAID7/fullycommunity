import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChannelService } from '../../../core/services/media/channel.service';
import { Channel, ChannelStats, Video } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-my-channel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-channel-container">
      @if (loading()) {
        <div class="loading">Loading your channel...</div>
      } @else if (channel()) {
        <!-- Channel Header -->
        <div class="channel-header">
          <div class="banner" [style.background-image]="channel()!.bannerUrl ? 'url(' + channel()!.bannerUrl + ')' : ''"></div>
          <div class="channel-info">
            <div class="avatar">{{ getInitials() }}</div>
            <div class="details">
              <h1>{{ channel()!.displayName }}</h1>
              <p class="handle">&#64;{{ channel()!.handle }}</p>
              <p class="stats">{{ channel()!.subscriberCount | number }} subscribers · {{ channel()!.videoCount }} videos</p>
            </div>
            <div class="actions">
              <a routerLink="/videos/studio" class="btn-primary">Manage Channel</a>
              <a routerLink="/videos/upload" class="btn-secondary">Upload Video</a>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        @if (stats()) {
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.totalViews | number }}</span>
              <span class="stat-label">Total Views</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.totalLikes | number }}</span>
              <span class="stat-label">Total Likes</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.totalComments | number }}</span>
              <span class="stat-label">Comments</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats()!.subscriberGrowth > 0 ? '+' : '' }}{{ stats()!.subscriberGrowth }}</span>
              <span class="stat-label">Subscribers (30d)</span>
            </div>
          </div>
        }

        <!-- Recent Videos -->
        <section class="videos-section">
          <h2>Your Videos</h2>
          <div class="video-grid">
            @for (video of videos(); track video.id) {
              <a [routerLink]="['/videos/watch', video.id]" class="video-card">
                <div class="thumbnail" [style.background-image]="'url(' + (video.thumbnailUrl || 'assets/video-placeholder.jpg') + ')'">
                  <span class="duration">{{ video.duration }}</span>
                </div>
                <div class="video-info">
                  <h3>{{ video.title }}</h3>
                  <span class="meta">{{ video.viewCount | number }} views · {{ video.createdAt | date:'mediumDate' }}</span>
                </div>
              </a>
            }
          </div>
          @if (videos().length === 0) {
            <div class="empty-state">
              <p>You haven't uploaded any videos yet</p>
              <a routerLink="/videos/upload" class="btn-primary">Upload your first video</a>
            </div>
          }
        </section>
      } @else {
        <div class="no-channel">
          <h2>Create Your Channel</h2>
          <p>Start sharing your automotive content with the community</p>
          <button class="btn-primary" (click)="createChannel()">Create Channel</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .my-channel-container { padding: 1rem; }
    .loading { text-align: center; padding: 4rem; color: #65676b; }
    .channel-header { margin-bottom: 2rem; }
    .banner { height: 200px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; margin-bottom: -60px; background-size: cover; background-position: center; }
    .channel-info { display: flex; align-items: flex-end; gap: 1.5rem; padding: 0 1rem; }
    .avatar { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #1877f2, #42b72a); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; border: 4px solid #fff; }
    .details { flex: 1; padding-bottom: 1rem; }
    .details h1 { font-size: 1.75rem; margin: 0 0 0.25rem; }
    .handle { color: #65676b; margin: 0 0 0.25rem; }
    .stats { color: #65676b; margin: 0; font-size: 0.9rem; }
    .actions { display: flex; gap: 0.75rem; padding-bottom: 1rem; }
    .btn-primary { padding: 0.625rem 1.25rem; background: #1877f2; color: #fff; border: none; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .btn-secondary { padding: 0.625rem 1.25rem; background: #e4e6eb; color: #050505; border: none; border-radius: 8px; text-decoration: none; font-weight: 500; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: #fff; padding: 1.25rem; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #1877f2; }
    .stat-label { font-size: 0.875rem; color: #65676b; }
    .videos-section h2 { font-size: 1.25rem; margin: 0 0 1rem; }
    .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
    .video-card { text-decoration: none; color: inherit; }
    .thumbnail { aspect-ratio: 16/9; background-size: cover; background-position: center; border-radius: 8px; position: relative; background-color: #e4e6eb; }
    .duration { position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }
    .video-info { padding: 0.75rem 0; }
    .video-info h3 { font-size: 0.95rem; font-weight: 500; margin: 0 0 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .meta { font-size: 0.8rem; color: #65676b; }
    .empty-state { text-align: center; padding: 3rem; background: #f0f2f5; border-radius: 12px; }
    .empty-state p { margin: 0 0 1rem; color: #65676b; }
    .no-channel { text-align: center; padding: 4rem 2rem; }
    .no-channel h2 { margin: 0 0 0.5rem; }
    .no-channel p { color: #65676b; margin: 0 0 1.5rem; }
  `]
})
export class MyChannelComponent implements OnInit {
  private channelService = inject(ChannelService);
  
  channel = signal<Channel | null>(null);
  stats = signal<ChannelStats | null>(null);
  videos = signal<Video[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadChannel();
  }

  loadChannel() {
    this.loading.set(true);
    this.channelService.getMyChannel().subscribe({
      next: (channel) => {
        this.channel.set(channel);
        this.loadStats();
        this.loadVideos(channel.id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadStats() {
    this.channelService.getMyStats().subscribe(stats => this.stats.set(stats));
  }

  loadVideos(channelId: string) {
    this.channelService.getChannelVideos(channelId).subscribe(result => this.videos.set(result.items));
  }

  getInitials(): string {
    const ch = this.channel();
    if (!ch) return 'C';
    return ch.displayName.charAt(0).toUpperCase();
  }

  createChannel() {
    // TODO: Open create channel modal
  }
}
