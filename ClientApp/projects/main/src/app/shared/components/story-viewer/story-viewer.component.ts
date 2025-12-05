import { Component, Input, Output, EventEmitter, signal, computed, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Story, StoriesService } from '../../../core/services/home/stories.service';

@Component({
  selector: 'app-story-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-viewer.component.html'
})
export class StoryViewerComponent implements OnInit, OnDestroy {
  @Input() stories: Story[] = [];
  @Input() currentIndex = 0;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() storyChanged = new EventEmitter<{ story: Story; index: number }>();

  private storiesService = inject(StoriesService);
  
  currentStory = computed(() => this.stories[this.currentIndex] || null);
  progress = signal(0);
  isPaused = signal(false);
  showControls = signal(true);
  
  private progressInterval?: number;
  private hideControlsTimeout?: number;
  private readonly STORY_DURATION = 5000; // 5 seconds per story

  ngOnInit(): void {
    if (this.isOpen) {
      this.startProgress();
      this.markAsViewed();
    }
    document.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy(): void {
    this.clearProgress();
    document.removeEventListener('keydown', this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.isOpen) return;
    
    switch (event.key) {
      case 'Escape':
        this.closeViewer();
        break;
      case 'ArrowLeft':
        this.previousStory();
        break;
      case 'ArrowRight':
        this.nextStory();
        break;
      case ' ':
        event.preventDefault();
        this.togglePause();
        break;
    }
  };

  startProgress(): void {
    this.clearProgress();
    this.progress.set(0);
    
    if (this.isPaused()) return;

    this.progressInterval = window.setInterval(() => {
      const current = this.progress();
      if (current >= 100) {
        this.nextStory();
      } else {
        this.progress.set(current + (100 / (this.STORY_DURATION / 100)));
      }
    }, 100);
  }

  clearProgress(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = undefined;
    }
  }

  togglePause(): void {
    this.isPaused.update(paused => !paused);
    if (this.isPaused()) {
      this.clearProgress();
    } else {
      this.startProgress();
    }
  }

  nextStory(): void {
    if (this.currentIndex < this.stories.length - 1) {
      this.currentIndex++;
      this.startProgress();
      this.markAsViewed();
      this.emitStoryChanged();
    } else {
      this.closeViewer();
    }
  }

  previousStory(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.startProgress();
      this.emitStoryChanged();
    }
  }

  goToStory(index: number): void {
    if (index >= 0 && index < this.stories.length) {
      this.currentIndex = index;
      this.startProgress();
      this.markAsViewed();
      this.emitStoryChanged();
    }
  }

  closeViewer(): void {
    this.clearProgress();
    this.close.emit();
  }

  private markAsViewed(): void {
    const story = this.currentStory();
    if (story && !story.isViewed) {
      this.storiesService.viewStory(story.id).subscribe({
        next: () => {
          // Update local state
          story.isViewed = true;
        },
        error: (error: any) => {
          console.error('Error marking story as viewed:', error);
        }
      });
    }
  }

  private emitStoryChanged(): void {
    const story = this.currentStory();
    if (story) {
      this.storyChanged.emit({ story, index: this.currentIndex });
    }
  }

  onMouseMove(): void {
    this.showControls.set(true);
    this.resetHideControlsTimer();
  }

  private resetHideControlsTimer(): void {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }
    this.hideControlsTimeout = window.setTimeout(() => {
      this.showControls.set(false);
    }, 3000);
  }

  likeStory(): void {
    const story = this.currentStory();
    if (!story) return;

    const isLiked = story.isLiked;
    const action = isLiked ? 
      this.storiesService.unlikeStory(story.id) : 
      this.storiesService.likeStory(story.id);

    // Optimistic update
    story.isLiked = !isLiked;
    story.likeCount = isLiked ? story.likeCount - 1 : story.likeCount + 1;

    action.subscribe({
      error: (error: any) => {
        console.error('Error toggling like:', error);
        // Revert optimistic update
        story.isLiked = isLiked;
        story.likeCount = isLiked ? story.likeCount + 1 : story.likeCount - 1;
      }
    });
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
}