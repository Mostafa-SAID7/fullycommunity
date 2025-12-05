import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { StoriesService, Story, StoryType } from '../../../../core/services/home/stories.service';
import { StoryViewerComponent } from '../../../../shared/components/story-viewer/story-viewer.component';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, StoryViewerComponent],
  templateUrl: './stories.component.html'
})
export class StoriesComponent implements OnInit {
  private authService = inject(AuthService);
  private storiesService = inject(StoriesService);
  
  user = this.authService.currentUser;
  stories = signal<Story[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  
  // Story viewer state
  showStoryViewer = signal(false);
  currentStoryIndex = signal(0);

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.storiesService.getStories().subscribe({
      next: (stories) => {
        this.stories.set(stories);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading stories:', error);
        this.stories.set([]);
        this.loadingState.set({ 
          isLoading: false, 
          error: 'Failed to load stories. Please try again.' 
        });
      }
    });
  }

  retryLoad(): void {
    this.loadStories();
  }

  viewStory(story: Story): void {
    const storyIndex = this.stories().findIndex(s => s.id === story.id);
    if (storyIndex !== -1) {
      this.currentStoryIndex.set(storyIndex);
      this.showStoryViewer.set(true);
    }
  }

  closeStoryViewer(): void {
    this.showStoryViewer.set(false);
  }

  onStoryChanged(event: { story: Story; index: number }): void {
    this.currentStoryIndex.set(event.index);
    // Update the story as viewed in our local state
    this.stories.update(stories =>
      stories.map(s => s.id === event.story.id ? { ...s, isViewed: true } : s)
    );
  }

  likeStory(story: Story, event: Event): void {
    event.stopPropagation();
    
    const isLiked = story.isLiked;
    const action = isLiked ? this.storiesService.unlikeStory(story.id) : this.storiesService.likeStory(story.id);

    // Optimistic update
    this.stories.update(stories =>
      stories.map(s => s.id === story.id ? { 
        ...s, 
        isLiked: !isLiked,
        likeCount: isLiked ? s.likeCount - 1 : s.likeCount + 1
      } : s)
    );

    action.subscribe({
      next: () => {
        console.log(`Story ${isLiked ? 'unliked' : 'liked'}:`, story.user.firstName);
      },
      error: (error) => {
        console.error('Error toggling like:', error);
        // Revert optimistic update
        this.stories.update(stories =>
          stories.map(s => s.id === story.id ? { 
            ...s, 
            isLiked: isLiked,
            likeCount: isLiked ? s.likeCount + 1 : s.likeCount - 1
          } : s)
        );
      }
    });
  }

  createStory(): void {
    // TODO: Open story creation modal
    console.log('Creating new story');
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }

  getStoryGradient(index: number): string {
    const gradients = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-yellow-400 to-red-500',
      'from-pink-400 to-red-500'
    ];
    return gradients[index % gradients.length];
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }

  getDisplayName(story: Story): string {
    if (story.page) {
      return story.page.name;
    }
    return `${story.user.firstName} ${story.user.lastName}`;
  }

  getDisplayAvatar(story: Story): string | undefined {
    if (story.page) {
      return story.page.profileImageUrl;
    }
    return story.user.avatarUrl;
  }

  isVerified(story: Story): boolean {
    if (story.page) {
      return story.page.isVerified;
    }
    return story.user.isVerified;
  }

  getStoryTypeIcon(type: StoryType): string {
    switch (type) {
      case StoryType.Video:
        return 'M8 5v14l11-7z';
      case StoryType.Live:
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
      case StoryType.Boomerang:
        return 'M12 2l3.09 6.26L22 9l-5.91 3.74L18 19l-6-3.27L6 19l1.91-6.26L2 9l6.91-.74L12 2z';
      default:
        return '';
    }
  }
}
