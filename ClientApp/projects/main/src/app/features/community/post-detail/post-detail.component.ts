import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommunityService, Post, PostComment } from '../../../core/services/community.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  post = signal<Post | null>(null);
  comments = signal<PostComment[]>([]);
  loading = signal(true);
  newComment = signal('');
  isLiked = signal(false);
  likeCount = signal(0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
    }
  }

  loadPost(id: string) {
    this.loading.set(true);
    this.communityService.getPost(id).subscribe({
      next: (post) => {
        this.post.set(post);
        this.isLiked.set(post.isLiked || false);
        this.likeCount.set(post.likeCount);
        this.loading.set(false);
        this.loadComments(id);
      },
      error: () => this.loading.set(false)
    });
  }

  loadComments(postId: string) {
    this.communityService.getComments(postId).subscribe({
      next: (result) => this.comments.set(result.items)
    });
  }
}
