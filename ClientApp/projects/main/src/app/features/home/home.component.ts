import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommunityService, Post, PostCategory } from '../../core/services/community.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private communityService = inject(CommunityService);
  private authService = inject(AuthService);

  user = this.authService.currentUser;
  featuredPosts = signal<Post[]>([]);
  categories = signal<PostCategory[]>([]);
  loading = signal(true);

  stats = signal({
    members: 12500,
    posts: 45000,
    experts: 350,
    garages: 1200
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.communityService.getPosts({ isFeatured: true }, 1, 6).subscribe({
      next: (result) => {
        this.featuredPosts.set(result.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.communityService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return postDate.toLocaleDateString();
  }
}
