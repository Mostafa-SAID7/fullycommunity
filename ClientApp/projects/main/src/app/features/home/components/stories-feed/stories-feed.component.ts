import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesService, Story } from '../../../../core/services';

@Component({
  selector: 'app-stories-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stories</h2>
      
      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>

      <!-- Stories Carousel -->
      <div *ngIf="!loading()" class="flex space-x-4 overflow-x-auto pb-2">
        <div
          *ngFor="let story of stories(); trackBy: trackByStoryId"
          (click)="openStory(story)"
          class="flex-shrink-0 cursor-pointer group"
        >
          <div class="relative">
            <!-- Story Thumbnail -->
            <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-pink-500 to-purple-500 p-0.5">
              <div class="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  [src]="story.thumbnailUrl || story.mediaUrl"
                  [alt]="story.user.firstName + ' story'"
                  class="w-full h-full object-cover"
                  (error)="onImageError($event)"
                />
              </div>
            </div>

            <!-- Page Badge -->
            <div
              *ngIf="story.page"
              class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white dark:border-gray-800"
            >
              <img
                [src]="story.page.profileImageUrl || '/assets/images/default-page.png'"
                [alt]="story.page.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Viewed Indicator -->
            <div
              *ngIf="story.isViewed"
              class="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600"
            ></div>
          </div>

          <!-- User Name -->
          <div class="mt-2 text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400 truncate w-16">
              {{ story.page ? story.page.name : story.user.firstName }}
            </p>
          </div>
        </div>

        <!-- Add Story Button (if user is logged in) -->
        <div class="flex-shrink-0 cursor-pointer group" (click)="openCreateStory()">
          <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="mt-2 text-center">
            <p class="text-xs text-gray-600 dark:text-gray-400">Add Story</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && stories().length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No stories yet</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Be the first to share a story with the community!
        </p>
      </div>
    </div>

    <!-- Story Viewer Modal -->
    <div
      *ngIf="selectedStory()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      (click)="closeStory()"
    >
      <div class="relative max-w-md w-full mx-4" (click)="$event.stopPropagation()">
        <!-- Story Content -->
        <div class="relative bg-black rounded-lg overflow-hidden">
          <!-- Progress Bar -->
          <div class="absolute top-0 left-0 right-0 z-10 p-4">
            <div class="w-full bg-gray-600 rounded-full h-1">
              <div class="bg-white h-1 rounded-full transition-all duration-300" [style.width.%]="storyProgress()"></div>
            </div>
          </div>

          <!-- Story Header -->
          <div class="absolute top-6 left-0 right-0 z-10 px-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img
                  [src]="selectedStory()!.user.avatarUrl || '/assets/images/default-avatar.png'"
                  [alt]="selectedStory()!.user.firstName"
                  class="w-8 h-8 rounded-full border-2 border-white"
                />
                <div>
                  <p class="text-white text-sm font-medium">
                    {{ selectedStory()!.page ? selectedStory()!.page!.name : selectedStory()!.user.firstName + ' ' + selectedStory()!.user.lastName }}
                  </p>
                  <p class="text-gray-300 text-xs">{{ getTimeAgo(selectedStory()!.createdAt) }}</p>
                </div>
              </div>
              <button (click)="closeStory()" class="text-white hover:text-gray-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Story Media -->
          <div class="aspect-[9/16] bg-gray-900">
            <img
              [src]="selectedStory()!.mediaUrl"
              [alt]="selectedStory()!.caption || 'Story'"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            />
          </div>

          <!-- Story Caption -->
          <div *ngIf="selectedStory()!.caption" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <p class="text-white text-sm">{{ selectedStory()!.caption }}</p>
          </div>

          <!-- Story Actions -->
          <div class="absolute bottom-4 right-4 flex space-x-2">
            <button
              (click)="toggleLike(selectedStory()!)"
              [class]="selectedStory()!.isLiked ? 'text-red-500' : 'text-white'"
              class="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
            </button>
            <button class="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
          </div>

          <!-- Navigation -->
          <button
            *ngIf="hasPreviousStory()"
            (click)="previousStory()"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            *ngIf="hasNextStory()"
            (click)="nextStory()"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class StoriesFeedComponent implements OnInit {
  private storiesService = inject(StoriesService);

  stories = signal<Story[]>([]);
  loading = signal(false);
  selectedStory = signal<Story | null>(null);
  currentStoryIndex = signal(0);
  storyProgress = signal(0);

  private storyTimer?: number;

  ngOnInit() {
    this.loadStories();
  }

  ngOnDestroy() {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }
  }

  trackByStoryId(index: number, story: Story): string {
    return story.id;
  }

  private loadStories() {
    this.loading.set(true);
    this.storiesService.getFollowingStories().subscribe({
      next: (stories) => {
        this.stories.set(stories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  openStory(story: Story) {
    const storyIndex = this.stories().findIndex(s => s.id === story.id);
    this.currentStoryIndex.set(storyIndex);
    this.selectedStory.set(story);
    this.startStoryTimer();
    
    // Mark as viewed
    if (!story.isViewed) {
      this.storiesService.viewStory(story.id).subscribe(() => {
        story.isViewed = true;
        story.viewCount++;
      });
    }
  }

  closeStory() {
    this.selectedStory.set(null);
    this.stopStoryTimer();
  }

  openCreateStory() {
    // TODO: Implement create story modal
    console.log('Open create story modal');
  }

  toggleLike(story: Story) {
    if (story.isLiked) {
      this.storiesService.unlikeStory(story.id).subscribe(() => {
        story.isLiked = false;
        story.likeCount--;
      });
    } else {
      this.storiesService.likeStory(story.id).subscribe(() => {
        story.isLiked = true;
        story.likeCount++;
      });
    }
  }

  hasPreviousStory(): boolean {
    return this.currentStoryIndex() > 0;
  }

  hasNextStory(): boolean {
    return this.currentStoryIndex() < this.stories().length - 1;
  }

  previousStory() {
    if (this.hasPreviousStory()) {
      const newIndex = this.currentStoryIndex() - 1;
      this.currentStoryIndex.set(newIndex);
      this.selectedStory.set(this.stories()[newIndex]);
      this.restartStoryTimer();
    }
  }

  nextStory() {
    if (this.hasNextStory()) {
      const newIndex = this.currentStoryIndex() + 1;
      this.currentStoryIndex.set(newIndex);
      this.selectedStory.set(this.stories()[newIndex]);
      this.restartStoryTimer();
    } else {
      this.closeStory();
    }
  }

  private startStoryTimer() {
    this.storyProgress.set(0);
    this.storyTimer = window.setInterval(() => {
      const progress = this.storyProgress() + 2; // 2% every 100ms = 5 seconds total
      if (progress >= 100) {
        this.nextStory();
      } else {
        this.storyProgress.set(progress);
      }
    }, 100);
  }

  private stopStoryTimer() {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
      this.storyTimer = undefined;
    }
    this.storyProgress.set(0);
  }

  private restartStoryTimer() {
    this.stopStoryTimer();
    this.startStoryTimer();
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/default-story.png';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  }
}