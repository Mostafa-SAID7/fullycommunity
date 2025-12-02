import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommunityService, Post, PostType, CreatePostRequest } from '../../../core/services/community.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';
import { StoriesComponent } from '../components/stories/stories.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PostCardComponent, CreatePostComponent, StoriesComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  posts = this.communityService.posts;
  loading = this.communityService.loading;
  hasMore = this.communityService.hasMore;

  activeFilter = signal<string>('all');
  filters = [
    { key: 'all', label: 'All Posts' },
    { key: 'General', label: 'General' },
    { key: 'Article', label: 'Articles' },
    { key: 'Question', label: 'Questions' },
    { key: 'Poll', label: 'Polls' }
  ];

  ngOnInit() {
    this.loadPosts(true);
  }

  loadPosts(reset = false) {
    const filter = this.activeFilter() === 'all' ? {} : { type: this.activeFilter() as PostType };
    this.communityService.loadPosts(filter, reset);
  }

  setFilter(key: string) {
    this.activeFilter.set(key);
    this.loadPosts(true);
  }

  onPostCreated(post: Post) {
    this.communityService.posts.update(posts => [post, ...posts]);
  }

  onPostDeleted(postId: string) {
    this.communityService.posts.update(posts => posts.filter(p => p.id !== postId));
  }

  loadMore() {
    if (!this.loading() && this.hasMore()) {
      this.loadPosts();
    }
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
