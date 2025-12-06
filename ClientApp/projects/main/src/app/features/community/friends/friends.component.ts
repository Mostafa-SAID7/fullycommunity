import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent } from '../../../shared/ui';
import { FriendsService, Friend, FriendRequest, FriendSuggestion } from '../../../core/services/community/friends.service';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent],
  templateUrl: './friends.component.html'
})
export class FriendsComponent implements OnInit {
  private friendsService = inject(FriendsService);

  activeTab = signal<'all' | 'requests' | 'suggestions'>('all');
  
  friends = signal<Friend[]>([]);
  friendRequests = signal<FriendRequest[]>([]);
  friendSuggestions = signal<FriendSuggestion[]>([]);
  
  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadingState.set({ isLoading: true, error: null });
    
    // Load friends
    this.friendsService.getFriends().subscribe({
      next: (friends) => this.friends.set(friends),
      error: (error) => {
        console.error('Error loading friends:', error);
        this.loadingState.set({ isLoading: false, error: 'Failed to load friends' });
      }
    });

    // Load friend requests
    this.friendsService.getFriendRequests().subscribe({
      next: (requests) => this.friendRequests.set(requests),
      error: (error) => {
        console.error('Error loading friend requests:', error);
        this.loadingState.set({ isLoading: false, error: 'Failed to load friend requests' });
      }
    });

    // Load friend suggestions
    this.friendsService.getFriendSuggestions().subscribe({
      next: (suggestions) => {
        this.friendSuggestions.set(suggestions);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading friend suggestions:', error);
        this.loadingState.set({ isLoading: false, error: 'Failed to load friends data' });
      }
    });
  }

  friendCount = () => this.friends().length;
  requestCount = () => this.friendRequests().length;
  suggestionCount = () => this.friendSuggestions().length;

  getCurrentTabData() {
    switch (this.activeTab()) {
      case 'requests': return this.friendRequests();
      case 'suggestions': return this.friendSuggestions();
      default: return this.friends();
    }
  }

  acceptRequest(request: FriendRequest): void {
    this.friendsService.acceptFriendRequest(request.requestId).subscribe({
      next: () => {
        // Move from requests to friends
        this.friendRequests.update(requests => 
          requests.filter(r => r.requestId !== request.requestId)
        );
        
        // Add to friends list
        const newFriend: Friend = {
          id: request.userId,
          firstName: request.firstName,
          lastName: request.lastName,
          avatarUrl: request.avatarUrl,
          userType: request.userType,
          friendsSince: new Date().toISOString(),
          mutualFriends: request.mutualFriends
        };
        
        this.friends.update(friends => [...friends, newFriend]);
      },
      error: (error) => console.error('Error accepting friend request:', error)
    });
  }

  declineRequest(request: FriendRequest): void {
    this.friendsService.declineFriendRequest(request.requestId).subscribe({
      next: () => {
        this.friendRequests.update(requests => 
          requests.filter(r => r.requestId !== request.requestId)
        );
      },
      error: (error) => console.error('Error declining friend request:', error)
    });
  }

  sendRequest(suggestion: FriendSuggestion): void {
    this.friendsService.sendFriendRequest(suggestion.id).subscribe({
      next: () => {
        // Remove from suggestions
        this.friendSuggestions.update(suggestions => 
          suggestions.filter(s => s.id !== suggestion.id)
        );
      },
      error: (error) => console.error('Error sending friend request:', error)
    });
  }

  removeSuggestion(suggestion: FriendSuggestion): void {
    this.friendSuggestions.update(suggestions => 
      suggestions.filter(s => s.id !== suggestion.id)
    );
  }

  unfriend(friend: Friend): void {
    if (confirm(`Remove ${friend.firstName} ${friend.lastName} from friends?`)) {
      this.friendsService.removeFriend(friend.id).subscribe({
        next: () => {
          this.friends.update(friends => 
            friends.filter(f => f.id !== friend.id)
          );
        },
        error: (error) => console.error('Error removing friend:', error)
      });
    }
  }

  blockUser(userId: string, firstName: string, lastName: string): void {
    if (confirm(`Block ${firstName} ${lastName}? They won't be able to find you or contact you.`)) {
      this.friendsService.blockUser(userId).subscribe({
        next: () => {
          // Remove from all lists
          this.friends.update(friends => friends.filter(f => f.id !== userId));
          this.friendRequests.update(requests => requests.filter(r => r.userId !== userId));
          this.friendSuggestions.update(suggestions => suggestions.filter(s => s.id !== userId));
        },
        error: (error) => console.error('Error blocking user:', error)
      });
    }
  }

  searchFriends(): void {
    const search = this.searchTerm();
    if (this.activeTab() === 'all') {
      this.friendsService.getFriends(search).subscribe({
        next: (friends) => this.friends.set(friends),
        error: (error) => console.error('Error searching friends:', error)
      });
    }
  }

  retryLoad(): void {
    this.loadAllData();
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  getUserInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
