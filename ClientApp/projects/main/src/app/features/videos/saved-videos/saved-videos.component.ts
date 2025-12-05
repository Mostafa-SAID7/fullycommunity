import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VideoService, SavedVideo, VideoCollection } from '../../../core/services/media/video.service';
import { VideoCardComponent } from '../shared/video-card.component';

@Component({
  selector: 'app-saved-videos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, VideoCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Saved Videos</h1>
          <button (click)="showCreateCollection.set(true)" 
            class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Collection
          </button>
        </div>

        <!-- Collections -->
        <div class="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button (click)="selectCollection(null)"
            [class]="!selectedCollection() 
              ? 'px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full whitespace-nowrap' 
              : 'px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
            All Saved
          </button>
          @for (collection of collections(); track collection.id) {
            <button (click)="selectCollection(collection)"
              [class]="selectedCollection()?.id === collection.id 
                ? 'px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full whitespace-nowrap' 
                : 'px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-300 dark:hover:bg-gray-600'">
              {{ collection.name }} ({{ collection.videoCount }})
            </button>
          }
        </div>

        <!-- Videos Grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="animate-pulse">
                <div class="aspect-video bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                <div class="flex gap-3 mt-3">
                  <div class="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (savedVideos().length) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            @for (saved of savedVideos(); track saved.id) {
              <div class="relative group">
                <app-video-card [video]="saved.video" />
                <button (click)="unsaveVideo(saved)" 
                  class="absolute top-2 right-2 p-2 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>
          
          @if (hasMore()) {
            <div class="text-center mt-8">
              <button (click)="loadMore()" [disabled]="loadingMore()"
                class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
                {{ loadingMore() ? 'Loading...' : 'Load More' }}
              </button>
            </div>
          }
        } @else {
          <div class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved videos</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Videos you save will appear here</p>
            <a routerLink="/videos" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
              Browse Videos
            </a>
          </div>
        }
      </div>

      <!-- Create Collection Modal -->
      @if (showCreateCollection()) {
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showCreateCollection.set(false)">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Collection</h3>
            <input type="text" [(ngModel)]="newCollectionName" placeholder="Collection name"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4">
            <textarea [(ngModel)]="newCollectionDesc" placeholder="Description (optional)" rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"></textarea>
            <label class="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
              <input type="checkbox" [(ngModel)]="newCollectionPrivate" class="rounded">
              Private collection
            </label>
            <div class="flex justify-end gap-3">
              <button (click)="showCreateCollection.set(false)" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                Cancel
              </button>
              <button (click)="createCollection()" [disabled]="!newCollectionName.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Create
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SavedVideosComponent implements OnInit {
  private videoService = inject(VideoService);

  savedVideos = signal<SavedVideo[]>([]);
  collections = signal<VideoCollection[]>([]);
  selectedCollection = signal<VideoCollection | null>(null);
  
  loading = signal(true);
  loadingMore = signal(false);
  hasMore = signal(true);
  showCreateCollection = signal(false);
  
  newCollectionName = '';
  newCollectionDesc = '';
  newCollectionPrivate = false;
  page = 1;

  ngOnInit() {
    this.loadCollections();
    this.loadSavedVideos();
  }

  loadCollections() {
    this.videoService.getCollections().subscribe(collections => this.collections.set(collections));
  }

  loadSavedVideos() {
    this.loading.set(true);
    this.page = 1;
    this.videoService.getSavedVideos(this.selectedCollection()?.id, 1, 20).subscribe({
      next: (result) => {
        this.savedVideos.set(result.items);
        this.hasMore.set(result.page < result.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadMore() {
    this.loadingMore.set(true);
    this.page++;
    this.videoService.getSavedVideos(this.selectedCollection()?.id, this.page, 20).subscribe({
      next: (result) => {
        this.savedVideos.update(v => [...v, ...result.items]);
        this.hasMore.set(result.page < result.totalPages);
        this.loadingMore.set(false);
      },
      error: () => this.loadingMore.set(false)
    });
  }

  selectCollection(collection: VideoCollection | null) {
    this.selectedCollection.set(collection);
    this.loadSavedVideos();
  }

  unsaveVideo(saved: SavedVideo) {
    this.videoService.unsaveVideo(saved.videoId).subscribe(() => {
      this.savedVideos.update(v => v.filter(x => x.id !== saved.id));
    });
  }

  createCollection() {
    if (!this.newCollectionName.trim()) return;
    this.videoService.createCollection({
      name: this.newCollectionName,
      description: this.newCollectionDesc || undefined,
      isPrivate: this.newCollectionPrivate
    }).subscribe(collection => {
      this.collections.update(c => [...c, collection]);
      this.showCreateCollection.set(false);
      this.newCollectionName = '';
      this.newCollectionDesc = '';
      this.newCollectionPrivate = false;
    });
  }
}
