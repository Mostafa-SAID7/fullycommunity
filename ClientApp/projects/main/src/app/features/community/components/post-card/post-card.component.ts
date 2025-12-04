import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommunityService, Post, PostComment } from '../../../../core/services/community.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-card.component.html'
})
export class PostCardComponent {
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);

  post = input.required<Post>();
  deleted = output<string>();

  user = this.authService.currentUser;
  showComments = signal(false);
  showMenu = signal(false);
  comments = signal<PostComment[]>([]);
  newComment = signal('');
  isLiked = signal(false);
  likeCount = signal(0);
  loadingComments = signal(false);
  submittingComment = signal(false);

  ngOnInit() {
    this.isLiked.set(this.post().isLiked || false);
    this.likeCount.set(this.post().likeCount);
  }

  toggleLike() {
    const postId = this.post().id;
    if (this.isLiked()) {
      this.communityService.unlikePost(postId).subscribe(() => {
        this.isLiked.set(false);
        this.likeCount.update(c => c - 1);
      });
    } else {
      this.communityService.likePost(postId).subscribe(() => {
        this.isLiked.set(true);
        this.likeCount.update(c => c + 1);
      });
    }
  }

  toggleComments() {
    this.showComments.update(v => !v);
    if (this.showComments() && this.comments().length === 0) {
      this.loadComments();
    }
  }

  loadComments() {
    this.loadingComments.set(true);
    this.communityService.getComments(this.post().id).subscribe({
      next: (result) => {
        this.comments.set(result.items);
        this.loadingComments.set(false);
      },
      error: () => this.loadingComments.set(false)
    });
  }

  submitComment() {
    if (!this.newComment().trim() || this.submittingComment()) return;

    this.submittingComment.set(true);
    this.communityService.addComment(this.post().id, this.newComment()).subscribe({
      next: (comment) => {
        this.comments.update(c => [comment, ...c]);
        this.newComment.set('');
        this.submittingComment.set(false);
      },
      error: () => this.submittingComment.set(false)
    });
  }

  sharePost() {
    this.communityService.sharePost(this.post().id).subscribe();
    // Could also open a share modal
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.communityService.deletePost(this.post().id).subscribe(() => {
        this.deleted.emit(this.post().id);
      });
    }
    this.showMenu.set(false);
  }

  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  getAuthorInitials(): string {
    const author = this.post().author;
    return ((author.firstName?.charAt(0) || '') + (author.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return postDate.toLocaleDateString();
  }

  isOwner(): boolean {
    return this.user()?.id === this.post().authorId;
  }
}
