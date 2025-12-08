import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VideosAdminService } from '../../../../../core/services/content/videos/videos-admin.service';
import { Video } from '../../../../../core/interfaces/content/videos/videos-admin.interface';

@Component({
  selector: 'app-videos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './videos-list.component.html'
})
export class VideosListComponent implements OnInit {
  private videosService = inject(VideosAdminService);
  
  videos = signal<Video[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 16;
  totalPages = signal(1);
  totalCount = signal(0);
  pendingCount = signal(0);
  searchQuery = '';
  selectedStatus = '';

  ngOnInit() {
    this.loadVideos();
    this.loadPendingCount();
  }

  loadVideos() {
    this.loading.set(true);
    
    this.videosService.getVideos(
      this.currentPage(),
      this.pageSize,
      this.selectedStatus || undefined,
      this.searchQuery || undefined
    ).subscribe({
      next: (response) => {
        this.videos.set(response.items);
        this.totalCount.set(response.totalCount);
        this.totalPages.set(Math.ceil(response.totalCount / this.pageSize));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.loading.set(false);
      }
    });
  }

  loadPendingCount() {
    this.videosService.getPendingCount().subscribe({
      next: (response) => this.pendingCount.set(response.count || 0),
      error: (error) => console.error('Error loading pending count:', error)
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadVideos();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.currentPage.set(1);
    this.loadVideos();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadVideos();
  }

  deleteVideo(video: Video) {
    if (!confirm(`Delete video "${video.title}"? This action cannot be undone.`)) return;

    this.videosService.deleteVideo(video.id).subscribe({
      next: () => this.loadVideos(),
      error: (error) => console.error('Error deleting video:', error)
    });
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
