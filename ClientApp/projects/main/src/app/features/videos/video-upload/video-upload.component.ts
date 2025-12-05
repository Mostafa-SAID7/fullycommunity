import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, VideoCategory, CreateVideoRequest, VideoVisibility } from '../../../core/services/media/video.service';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="flex items-center gap-4 mb-6">
          <a routerLink="/videos/studio" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Upload Video</h1>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          @switch (step()) {
            @case (1) {
              <!-- Step 1: Upload File -->
              <div class="p-8">
                <div 
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  (click)="fileInput.click()"
                  (dragover)="onDragOver($event)"
                  (drop)="onDrop($event)">
                  <input #fileInput type="file" accept="video/*" class="hidden" (change)="onFileSelected($event)">
                  
                  @if (uploading()) {
                    <div class="space-y-4">
                      <div class="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p class="text-gray-600 dark:text-gray-400">Uploading... {{ uploadProgress() }}%</p>
                      <div class="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all" [style.width.%]="uploadProgress()"></div>
                      </div>
                    </div>
                  } @else {
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Drag and drop video files to upload</p>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">Your videos will be private until you publish them</p>
                    <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Select Files
                    </button>
                  }
                </div>
                
                <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>Supported formats: MP4, MOV, AVI, MKV, WebM</p>
                  <p>Maximum file size: 10GB</p>
                </div>
              </div>
            }
            
            @case (2) {
              <!-- Step 2: Video Details -->
              <div class="p-6">
                <div class="flex gap-6">
                  <!-- Preview -->
                  <div class="w-80 flex-shrink-0">
                    <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                      @if (thumbnailPreview()) {
                        <img [src]="thumbnailPreview()" class="w-full h-full object-cover">
                      } @else if (selectedFile()) {
                        <video [src]="videoPreviewUrl()" class="w-full h-full object-cover"></video>
                      }
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail</label>
                      <input type="file" accept="image/*" (change)="onThumbnailSelected($event)"
                        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {{ selectedFile()?.name }}<br>
                      {{ formatFileSize(selectedFile()?.size || 0) }}
                    </p>
                  </div>

                  <!-- Form -->
                  <div class="flex-1 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                      <input type="text" [(ngModel)]="videoDetails.title" maxlength="100"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <p class="text-xs text-gray-500 mt-1">{{ videoDetails.title.length }}/100</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea [(ngModel)]="videoDetails.description" rows="4" maxlength="5000"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                      <p class="text-xs text-gray-500 mt-1">{{ videoDetails.description?.length || 0 }}/5000</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select [(ngModel)]="videoDetails.categoryId"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="">Select category</option>
                          @for (cat of categories(); track cat.id) {
                            <option [value]="cat.id">{{ cat.name }}</option>
                          }
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                        <select [(ngModel)]="videoDetails.visibility"
                          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                          <option value="Public">Public</option>
                          <option value="Unlisted">Unlisted</option>
                          <option value="Private">Private</option>
                          <option value="FollowersOnly">Followers Only</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                      <input type="text" [(ngModel)]="tagsInput" placeholder="Add tags separated by commas"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hashtags</label>
                      <input type="text" [(ngModel)]="hashtagsInput" placeholder="#car #review #automotive"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    </div>

                    <div class="space-y-2">
                      <label class="flex items-center gap-2">
                        <input type="checkbox" [(ngModel)]="videoDetails.allowComments" class="rounded">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Allow comments</span>
                      </label>
                      <label class="flex items-center gap-2">
                        <input type="checkbox" [(ngModel)]="videoDetails.allowDownloads" class="rounded">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Allow downloads</span>
                      </label>
                      <label class="flex items-center gap-2">
                        <input type="checkbox" [(ngModel)]="videoDetails.allowDuets" class="rounded">
                        <span class="text-sm text-gray-700 dark:text-gray-300">Allow duets & stitches</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button (click)="step.set(1)" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Back
                  </button>
                  <button (click)="saveDraft()" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Save as Draft
                  </button>
                  <button (click)="publish()" [disabled]="!videoDetails.title || publishing()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    {{ publishing() ? 'Publishing...' : 'Publish' }}
                  </button>
                </div>
              </div>
            }
            
            @case (3) {
              <!-- Step 3: Success -->
              <div class="p-12 text-center">
                <div class="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Published!</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">Your video is now live and ready to be watched</p>
                <div class="flex justify-center gap-4">
                  <a [routerLink]="['/videos/watch', uploadedVideoId()]" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    View Video
                  </a>
                  <button (click)="uploadAnother()" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Upload Another
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class VideoUploadComponent implements OnInit {
  private router = inject(Router);
  private videoService = inject(VideoService);

  step = signal(1);
  categories = signal<VideoCategory[]>([]);
  selectedFile = signal<File | null>(null);
  videoPreviewUrl = signal('');
  thumbnailPreview = signal('');
  uploading = signal(false);
  uploadProgress = signal(0);
  publishing = signal(false);
  uploadedVideoId = signal('');

  videoDetails: CreateVideoRequest & { allowComments: boolean; allowDownloads: boolean; allowDuets: boolean } = {
    title: '',
    description: '',
    categoryId: '',
    visibility: 'Public' as VideoVisibility,
    allowComments: true,
    allowDownloads: true,
    allowDuets: true
  };
  
  tagsInput = '';
  hashtagsInput = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.videoService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }
    
    this.selectedFile.set(file);
    this.videoPreviewUrl.set(URL.createObjectURL(file));
    this.videoDetails.title = file.name.replace(/\.[^/.]+$/, '');
    
    // Simulate upload
    this.uploading.set(true);
    this.uploadProgress.set(0);
    
    const interval = setInterval(() => {
      this.uploadProgress.update(p => {
        if (p >= 100) {
          clearInterval(interval);
          this.uploading.set(false);
          this.step.set(2);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 200);
  }

  onThumbnailSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.thumbnailPreview.set(URL.createObjectURL(file));
    }
  }

  saveDraft() {
    this.initiateUpload(false);
  }

  publish() {
    this.initiateUpload(true);
  }

  private initiateUpload(publish: boolean) {
    this.publishing.set(true);
    
    const request: CreateVideoRequest = {
      title: this.videoDetails.title,
      description: this.videoDetails.description,
      categoryId: this.videoDetails.categoryId || undefined,
      visibility: this.videoDetails.visibility,
      allowComments: this.videoDetails.allowComments,
      allowDuets: this.videoDetails.allowDuets,
      allowDownloads: this.videoDetails.allowDownloads,
      tags: this.tagsInput.split(',').map(t => t.trim()).filter(t => t),
      hashtags: this.hashtagsInput.split(/[\s,#]+/).filter(t => t)
    };

    this.videoService.initiateUpload(request).subscribe({
      next: (response) => {
        // In real app, upload to the provided URL
        // Then complete the upload
        this.videoService.completeUpload(
          response.videoId, 
          this.videoPreviewUrl(), 
          this.thumbnailPreview() || undefined
        ).subscribe({
          next: (video) => {
            if (publish) {
              this.videoService.publishVideo(video.id).subscribe({
                next: () => {
                  this.uploadedVideoId.set(video.id);
                  this.step.set(3);
                  this.publishing.set(false);
                },
                error: () => this.publishing.set(false)
              });
            } else {
              this.router.navigate(['/videos/studio']);
            }
          },
          error: () => this.publishing.set(false)
        });
      },
      error: () => this.publishing.set(false)
    });
  }

  uploadAnother() {
    this.step.set(1);
    this.selectedFile.set(null);
    this.videoPreviewUrl.set('');
    this.thumbnailPreview.set('');
    this.uploadedVideoId.set('');
    this.videoDetails = {
      title: '',
      description: '',
      categoryId: '',
      visibility: 'Public',
      allowComments: true,
      allowDownloads: true,
      allowDuets: true
    };
    this.tagsInput = '';
    this.hashtagsInput = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
