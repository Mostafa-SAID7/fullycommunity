import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  viewed: boolean;
  createdAt: string;
  type?: 'image' | 'video';
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.component.html'
})
export class StoriesComponent {
  private authService = inject(AuthService);
  
  user = this.authService.currentUser;
  
  stories = signal<Story[]>([
    { 
      id: '1', 
      userId: '1', 
      userName: 'John Doe', 
      imageUrl: 'https://images.unsplash.com/photo-1549927681-0b673b922a7b?w=400&h=600&fit=crop', 
      viewed: false, 
      createdAt: new Date().toISOString(),
      type: 'image'
    },
    { 
      id: '2', 
      userId: '2', 
      userName: 'Alice Smith', 
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop', 
      viewed: false, 
      createdAt: new Date().toISOString(),
      type: 'image'
    },
    { 
      id: '3', 
      userId: '3', 
      userName: 'Bob Wilson', 
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop', 
      viewed: true, 
      createdAt: new Date().toISOString(),
      type: 'image'
    },
    { 
      id: '4', 
      userId: '4', 
      userName: 'Emma Davis', 
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=600&fit=crop', 
      viewed: false, 
      createdAt: new Date().toISOString(),
      type: 'image'
    },
    { 
      id: '5', 
      userId: '5', 
      userName: 'Mike Chen', 
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop', 
      viewed: false, 
      createdAt: new Date().toISOString(),
      type: 'image'
    }
  ]);

  viewStory(story: Story): void {
    this.stories.update(stories =>
      stories.map(s => s.id === story.id ? { ...s, viewed: true } : s)
    );
    // TODO: Open story viewer modal
    console.log('Viewing story:', story.userName);
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
}
