import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  viewed: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stories-container">
      <!-- Create Story -->
      <div class="story-card create-story">
        <div class="story-image">
          <div class="avatar">{{ getUserInitials() }}</div>
        </div>
        <div class="create-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>
        <span class="story-label">Create Story</span>
      </div>

      <!-- Stories -->
      @for (story of stories(); track story.id) {
        <div class="story-card" [class.viewed]="story.viewed" (click)="viewStory(story)">
          <div class="story-image" [style.background-image]="'url(' + story.imageUrl + ')'">
            <div class="story-avatar" [class.has-image]="story.userAvatar">
              @if (story.userAvatar) {
                <img [src]="story.userAvatar" [alt]="story.userName">
              } @else {
                <span>{{ story.userName.charAt(0) }}</span>
              }
            </div>
          </div>
          <span class="story-name">{{ story.userName }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .stories-container {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
    }

    .story-card {
      position: relative;
      width: 110px;
      height: 190px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      flex-shrink: 0;
      background: #e4e6eb;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.02);
      }

      &.viewed .story-avatar {
        border-color: #ccc;
      }
    }

    .story-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .story-avatar {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid #1877f2;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .story-name {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // Create Story
    .create-story {
      .story-image {
        height: 75%;
        background: linear-gradient(135deg, #1877f2, #42b72a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        color: #1877f2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .create-btn {
        position: absolute;
        top: calc(75% - 18px);
        left: 50%;
        transform: translateX(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #1877f2;
        border: 4px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 20px;
          height: 20px;
          color: #fff;
        }
      }

      .story-label {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 600;
        color: #050505;
      }
    }
  `]
})
export class StoriesComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  stories = signal<Story[]>([
    { id: '1', userId: '1', userName: 'John Doe', imageUrl: '/assets/stories/story1.jpg', viewed: false, createdAt: new Date().toISOString() },
    { id: '2', userId: '2', userName: 'Alice Smith', imageUrl: '/assets/stories/story2.jpg', viewed: false, createdAt: new Date().toISOString() },
    { id: '3', userId: '3', userName: 'Bob Wilson', imageUrl: '/assets/stories/story3.jpg', viewed: true, createdAt: new Date().toISOString() },
    { id: '4', userId: '4', userName: 'Emma Davis', imageUrl: '/assets/stories/story4.jpg', viewed: false, createdAt: new Date().toISOString() }
  ]);

  viewStory(story: Story) {
    this.stories.update(stories => 
      stories.map(s => s.id === story.id ? { ...s, viewed: true } : s)
    );
    // Open story viewer modal
  }

  getUserInitials(): string {
    const u = this.user();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
