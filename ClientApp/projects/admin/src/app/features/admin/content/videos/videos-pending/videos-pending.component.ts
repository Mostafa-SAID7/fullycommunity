import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../../environments/environment';

interface PendingVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploaderName: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-videos-pending',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Pending Videos</h1>
        <p class="text-gray-600">Review and approve video submissions</p>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (!loading() && videos().length > 0) {
        <div class="space-y-4">
          @for (video of videos(); track video.id) {
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex gap-6">
                <div class="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0">
                  @if (video.thumbnailUrl) {
                    <img [src]="video.thumbnailUrl" [alt]="video.title" class="w-full h-full object-cover rounded-lg" />
                  } @else {
                    <div class="flex items-center justify-center h-full text-gray-400 text-4xl">
                      🎥
                    </div>
                  }
                </div>

                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ video.title }}</h3>
                  <p class="text-sm text-gray-600 mb-4">{{ video.description }}</p>
                  <div class="text-sm text-gray-500">
                    Uploaded by {{ video.uploaderName }} • {{ formatDate(video.uploadedAt) }}
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button
                    (click)="approveVideo(video)"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    (click)="rejectVideo(video)"
                    class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (!loading() && videos().length === 0) {
        <div class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="text-gray-400 text-6xl mb-4">✅</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No pending videos</h3>
          <p class="text-gray-600">All videos have been reviewed</p>
        </div>
      }
    </div>
  `
})
export class VideosPendingComponent implements OnInit {
  private http = inject(HttpClient);
  
  videos = signal<PendingVideo[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPendingVideos();
  }

  loadPendingVideos() {
    this.loading.set(true);
    
    this.http.get<any>(`${environment.apiUrl}/admin/dashboard/videos/pending`).subscribe({
      next: (response) => {
        this.videos.set(response.items || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending videos:', error);
        this.loading.set(false);
      }
    });
  }

  approveVideo(video: PendingVideo) {
    this.http.post(`${environment.apiUrl}/admin/dashboard/videos/${video.id}/approve`, {}).subscribe({
      next: () => this.loadPendingVideos(),
      error: (error) => console.error('Error approving video:', error)
    });
  }

  rejectVideo(video: PendingVideo) {
    const reason = prompt('Reason for rejection (optional):');
    
    this.http.post(`${environment.apiUrl}/admin/dashboard/videos/${video.id}/reject`, { reason }).subscribe({
      next: () => this.loadPendingVideos(),
      error: (error) => console.error('Error rejecting video:', error)
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
