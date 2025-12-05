import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommunityService, Post } from '../../../../core/services/community/community.service';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-featured-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-posts.component.html'
})
export class FeaturedPostsComponent implements OnInit {
  private communityService = inject(CommunityService);

  posts = signal<Post[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.communityService.getPosts({ isFeatured: true }, 1, 6).subscribe({
      next: (result: any) => {
        this.posts.set(result.items || []);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading featured posts:', error);
        this.posts.set([]);
        this.loadingState.set({ 
          isLoading: false, 
          error: 'Failed to load featured posts. Please try again.' 
        });
      }
    });
  }

  retryLoad(): void {
    this.loadPosts();
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}