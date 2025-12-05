import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, Video, VideoCategory, VideoFeedRequest, Channel } from '../../../core/services/media/video.service';
import { ChannelService } from '../../../core/services/media/channel.service';
import { VideoCardComponent } from '../shared/video-card.component';

@Component({
  selector: 'app-video-feed',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, VideoCardComponent],
  templateUrl: './video-feed.component.html'
})
export class VideoFeedComponent implements OnInit {
  private videoService = inject(VideoService);
  private channelService = inject(ChannelService);

  videos = signal<Video[]>([]);
  categories = signal<VideoCategory[]>([]);
  trendingHashtags = signal<{ hashtag: string; count: number }[]>([]);
  suggestedChannels = signal<Channel[]>([]);
  
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  error = signal<string | null>(null);
  categoriesError = signal<string | null>(null);
  hashtagsError = signal<string | null>(null);
  channelsError = signal<string | null>(null);
  
  feedType = signal<'ForYou' | 'Following' | 'Trending' | 'New'>('ForYou');
  selectedCategory = signal<VideoCategory | null>(null);
  searchQuery = '';
  page = 1;

  feedTabs = [
    { label: 'For You', value: 'ForYou' as const },
    { label: 'Following', value: 'Following' as const },
    { label: 'Trending', value: 'Trending' as const },
    { label: 'New', value: 'New' as const }
  ];

  ngOnInit() {
    this.loadFeed();
    this.loadCategories();
    this.loadTrendingHashtags();
    this.loadSuggestedChannels();
  }

  loadFeed() {
    this.loading.set(true);
    this.error.set(null);
    this.page = 1;
    const request: VideoFeedRequest = {
      feedType: this.feedType(),
      page: this.page,
      pageSize: 20
    };
    
    this.videoService.getFeed(request).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || err?.message || 'Failed to load videos. Please try again.');
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;
    const request: VideoFeedRequest = {
      feedType: this.feedType(),
      page: this.page,
      pageSize: 20
    };
    
    this.videoService.getFeed(request).subscribe({
      next: (result) => {
        this.videos.update(v => [...v, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }

  loadCategories() {
    this.videoService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => this.categoriesError.set(err?.message || 'Failed to load categories')
    });
  }

  loadTrendingHashtags() {
    this.videoService.getTrendingHashtags(10).subscribe({
      next: (tags) => this.trendingHashtags.set(tags),
      error: (err) => this.hashtagsError.set(err?.message || 'Failed to load hashtags')
    });
  }

  loadSuggestedChannels() {
    this.channelService.getSuggestedChannels(5).subscribe({
      next: (channels) => this.suggestedChannels.set(channels),
      error: (err) => this.channelsError.set(err?.message || 'Failed to load channels')
    });
  }

  setFeedType(type: 'ForYou' | 'Following' | 'Trending' | 'New') {
    this.feedType.set(type);
    this.loadFeed();
  }

  selectCategory(category: VideoCategory | null) {
    this.selectedCategory.set(category);
    this.loadFeed();
  }

  search() {
    if (!this.searchQuery.trim()) return;
    this.loading.set(true);
    this.error.set(null);
    this.videoService.searchVideos({ query: this.searchQuery, page: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Search failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  searchByHashtag(hashtag: string) {
    this.loading.set(true);
    this.error.set(null);
    this.videoService.searchVideos({ hashtag, page: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.videos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Search failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  formatSubscribers(count: number): string {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  }
}
