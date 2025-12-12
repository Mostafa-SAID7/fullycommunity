import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { StoriesService } from '../../../../core/services/home/stories.service';
import { Story, StoryMediaType } from '../../../../core/interfaces/home/stories.interface';
import { StoryViewerComponent } from '../../../../shared/components/story-viewer/story-viewer.component';
import { CreateStoryModalComponent } from '../../../../shared/components/create-story-modal/create-story-modal.component';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, StoryViewerComponent, CreateStoryModalComponent],
  templateUrl: './stories.component.html'
})
export class StoriesComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private storiesService = inject(StoriesService);
  
  user = this.authService.currentUser;
  stories = signal<Story[]>([]);
  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  
  // Story viewer state
  showStoryViewer = signal(false);
  currentStoryIndex = signal(0);
  
  // Create story modal state
  showCreateModal = signal(false);
  
  // Story timer for auto-progression
  private storyTimer?: number;

  ngOnInit(): void {
    this.loadStories();
  }

  ngOnDestroy(): void {
    if (this.storyTimer) {
      clearInterval(this.storyTimer);
    }
  }

  loadStories(): void {
    this.loadingState.set({ isLoading: true, error: null });

    this.storiesService.getMyStories().subscribe({
      next: (stories: Story[]) => {
        this.stories.set(stories);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error: any) => {
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
        console.log(`Story ${isLiked ? 'unliked' : 'liked'}:`, story.user?.firstName || story.authorName);
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
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onStoryCreated(): void {
    this.showCreateModal.set(false);
    this.loadStories(); // Refresh stories after creation
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
    if (story.user) {
      return `${story.user.firstName} ${story.user.lastName}`;
    }
    return story.authorName;
  }

  getDisplayAvatar(story: Story): string | undefined {
    if (story.page) {
      return story.page.profileImageUrl || undefined;
    }
    if (story.user) {
      return story.user.avatarUrl || undefined;
    }
    return story.authorAvatarUrl || undefined;
  }

  isVerified(story: Story): boolean {
    if (story.page) {
      return story.page.isVerified;
    }
    if (story.user) {
      return story.user.isVerified;
    }
    return story.authorVerified;
  }

  getStoryTypeIcon(type: StoryMediaType | string): string {
    const mediaType = typeof type === 'string' ? type : type.toString();
    switch (mediaType) {
      case 'Video':
      case StoryMediaType.Video.toString():
        return 'M8 5v14l11-7z';
      case 'Text':
      case StoryMediaType.Text.toString():
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
      default:
        return '';
    }
  }
}
