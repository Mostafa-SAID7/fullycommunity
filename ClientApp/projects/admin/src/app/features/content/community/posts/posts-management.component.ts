import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DateUtils } from '../../../../core/utils/date.utils';

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  status: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-posts-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './posts-management.component.html'
})
export class PostsManagementComponent implements OnInit {
  private http = inject(HttpClient);
  
  posts = signal<Post[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 20;
  totalPages = signal(1);
  totalCount = signal(0);
  selectedStatus = signal<string>('');
  searchQuery = signal('');

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    
    let params = new HttpParams()
      .set('page', this.currentPage().toString())
      .set('pageSize', this.pageSize.toString());
    
    if (this.selectedStatus()) params = params.set('status', this.selectedStatus());
    if (this.searchQuery()) params = params.set('search', this.searchQuery());

    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/community/posts`, { params }).subscribe({
      next: (response) => {
        if (response.items) {
          this.posts.set(response.items);
          this.totalCount.set(response.totalCount);
          this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading.set(false);
      }
    });
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadPosts();
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadPosts();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadPosts();
  }

  approvePost(post: Post) {
    if (!confirm(`Approve post "${post.title}"?`)) return;

    this.http.post(`${environment.apiUrl}/admin/dashboard/community/posts/${post.id}/approve`, {}).subscribe({
      next: () => this.loadPosts(),
      error: (error) => console.error('Error approving post:', error)
    });
  }

  deletePost(post: Post) {
    if (!confirm(`Delete post "${post.title}"? This action cannot be undone.`)) return;

    this.http.delete(`${environment.apiUrl}/admin/dashboard/community/posts/${post.id}`).subscribe({
      next: () => this.loadPosts(),
      error: (error) => console.error('Error deleting post:', error)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate = DateUtils.formatDate;
}
