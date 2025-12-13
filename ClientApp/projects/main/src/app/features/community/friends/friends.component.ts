import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent } from '../../../shared/ui';
import { FriendsService } from '../../../core/services/community/friends';
import { Friend, FriendRequest } from '../../../core/interfaces/community/friends';
import { SidebarLayoutComponent } from '../../../shared/components/sidebar-layout/sidebar-layout.component';
import { type SidebarMenuItem, type SidebarShortcut } from '../../../shared/components/left-sidebar/left-sidebar.component';
import { type SponsoredItem, type EventReminder, type Contact } from '../../../shared/components/right-sidebar/right-sidebar.component';
import { PagedResult } from '../../../core/types';



export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent, SidebarLayoutComponent],
  templateUrl: './friends.component.html'
})
export class FriendsComponent implements OnInit {
  private friendsService = inject(FriendsService);

  activeTab = signal<'all' | 'requests' | 'suggestions'>('all');

  // Sidebar configuration
  shortcuts: SidebarShortcut[] = [
    { id: '1', name: 'Car Enthusiasts', image: '/assets/groups/car-enthusiasts.jpg', type: 'group' },
    { id: '2', name: 'DIY Mechanics', image: '/assets/groups/diy-mechanics.jpg', type: 'group' }
  ];

  sponsoredItems: SponsoredItem[] = [
    { id: '1', title: 'Premium Car Parts', url: 'autoparts.com', image: '/assets/ads/car-parts.jpg' }
  ];

  events: EventReminder[] = [
    { id: '1', title: 'Car Meet - Downtown', time: 'Tomorrow at 6:00 PM' }
  ];

  contacts: Contact[] = [
    { id: '1', name: 'John Doe', initials: 'JD', online: true },
    { id: '2', name: 'Alice Smith', initials: 'AS', online: true }
  ];

  friends = signal<Friend[]>([]);
  friendRequests = signal<FriendRequest[]>([]);
  friendSuggestions = signal<Friend[]>([]);

  loadingState = signal<LoadingState>({ isLoading: true, error: null });
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadingState.set({ isLoading: true, error: null });

    // Load friends
    this.friendsService.getFriends(undefined, 1, 50).subscribe({
      next: (result: PagedResult<Friend>) => {
        this.friends.set(result.items || []);
      },
      error: (error: any) => {
        console.error('Error loading friends:', error);
        this.loadingState.set({ isLoading: false, error: 'Failed to load friends' });
      }
    });

    // Load friend requests
    this.friendsService.getFriendRequests().subscribe({
      next: (result: PagedResult<FriendRequest>) => {
        this.friendRequests.set(result.items || []);
      },
      error: (error: any) => {
        console.error('Error loading friend requests:', error);
        this.loadingState.set({ isLoading: false, error: 'Failed to load friend requests' });
      }
    });

    // Load friend suggestions
    this.friendsService.getSuggestions(10).subscribe({
      next: (suggestions: Friend[]) => {
        this.friendSuggestions.set(suggestions);
        this.loadingState.set({ isLoading: false, error: null });
      },
      error: (error: any) => {
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
    this.friendsService.acceptFriendRequest(request.id).subscribe({
      next: () => {
        // Move from requests to friends
        this.friendRequests.update(requests =>
          requests.filter(r => r.id !== request.id)
        );

        // Add to friends list
        const newFriend: Friend = {
          userId: request.requesterId,
          userName: request.requesterName,
          avatarUrl: request.requesterAvatarUrl,
          bio: null,
          friendsSince: new Date().toISOString(),
          isOnline: false,
          mutualFriends: request.mutualFriends
        };

        this.friends.update(friends => [...friends, newFriend]);
      },
      error: (error: any) => console.error('Error accepting friend request:', error)
    });
  }

  declineRequest(request: FriendRequest): void {
    this.friendsService.declineFriendRequest(request.id).subscribe({
      next: () => {
        this.friendRequests.update(requests =>
          requests.filter(r => r.id !== request.id)
        );
      },
      error: (error: any) => console.error('Error declining friend request:', error)
    });
  }

  sendRequest(suggestion: Friend): void {
    this.friendsService.sendFriendRequest(suggestion.userId).subscribe({
      next: () => {
        // Remove from suggestions
        this.friendSuggestions.update(suggestions =>
          suggestions.filter(s => s.userId !== suggestion.userId)
        );
      },
      error: (error: any) => console.error('Error sending friend request:', error)
    });
  }

  removeSuggestion(suggestion: Friend): void {
    this.friendSuggestions.update(suggestions =>
      suggestions.filter(s => s.userId !== suggestion.userId)
    );
  }

  unfriend(friend: Friend): void {
    if (confirm(`Remove ${friend.userName} from friends?`)) {
      this.friendsService.removeFriend(friend.userId).subscribe({
        next: () => {
          this.friends.update(friends =>
            friends.filter(f => f.userId !== friend.userId)
          );
        },
        error: (error: any) => console.error('Error removing friend:', error)
      });
    }
  }

  blockUser(userId: string, firstName: string, lastName: string): void {
    if (confirm(`Block ${firstName} ${lastName}? They won't be able to find you or contact you.`)) {
      this.friendsService.blockUser(userId).subscribe({
        next: () => {
          // Remove from all lists
          this.friends.update(friends => friends.filter(f => f.userId !== userId));
          this.friendRequests.update(requests => requests.filter(r => r.requesterId !== userId));
          this.friendSuggestions.update(suggestions => suggestions.filter(s => s.userId !== userId));
        },
        error: (error: any) => console.error('Error blocking user:', error)
      });
    }
  }

  searchFriends(): void {
    const search = this.searchTerm();
    if (this.activeTab() === 'all') {
      this.friendsService.searchFriends(search).subscribe({
        next: (result: PagedResult<Friend>) => this.friends.set(result.items || []),
        error: (error: any) => console.error('Error searching friends:', error)
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
