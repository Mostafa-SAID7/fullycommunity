import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent } from '../../../shared/ui';

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  mutualFriends: number;
  isFriend: boolean;
  isPending: boolean;
}

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent, InputComponent, BadgeComponent, AvatarComponent],
  templateUrl: './friends.component.html'
})
export class FriendsComponent {
  activeTab = signal<'all' | 'requests' | 'suggestions'>('all');

  friends = signal<Friend[]>([
    { id: '1', firstName: 'John', lastName: 'Doe', mutualFriends: 12, isFriend: true, isPending: false },
    { id: '2', firstName: 'Alice', lastName: 'Smith', mutualFriends: 8, isFriend: true, isPending: false },
    { id: '3', firstName: 'Bob', lastName: 'Wilson', mutualFriends: 5, isFriend: true, isPending: false },
    { id: '4', firstName: 'Emma', lastName: 'Davis', mutualFriends: 15, isFriend: false, isPending: true },
    { id: '5', firstName: 'Mike', lastName: 'Johnson', mutualFriends: 3, isFriend: false, isPending: true },
    { id: '6', firstName: 'Sarah', lastName: 'Brown', mutualFriends: 7, isFriend: false, isPending: false },
    { id: '7', firstName: 'David', lastName: 'Lee', mutualFriends: 4, isFriend: false, isPending: false }
  ]);

  friendCount = () => this.friends().filter(f => f.isFriend).length;
  requestCount = () => this.friends().filter(f => f.isPending).length;

  filteredFriends() {
    switch (this.activeTab()) {
      case 'requests': return this.friends().filter(f => f.isPending);
      case 'suggestions': return this.friends().filter(f => !f.isFriend && !f.isPending);
      default: return this.friends().filter(f => f.isFriend);
    }
  }

  acceptRequest(friend: Friend) {
    this.friends.update(friends => 
      friends.map(f => f.id === friend.id ? { ...f, isFriend: true, isPending: false } : f)
    );
  }

  declineRequest(friend: Friend) {
    this.friends.update(friends => 
      friends.map(f => f.id === friend.id ? { ...f, isPending: false } : f)
    );
  }

  sendRequest(friend: Friend) {
    this.friends.update(friends => 
      friends.map(f => f.id === friend.id ? { ...f, isPending: true } : f)
    );
  }

  removeSuggestion(friend: Friend) {
    this.friends.update(friends => friends.filter(f => f.id !== friend.id));
  }

  unfriend(friend: Friend) {
    if (confirm(`Remove ${friend.firstName} from friends?`)) {
      this.friends.update(friends => 
        friends.map(f => f.id === friend.id ? { ...f, isFriend: false } : f)
      );
    }
  }
}
