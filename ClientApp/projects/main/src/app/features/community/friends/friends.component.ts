import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  template: `
    <div class="friends-page">
      <div class="page-header">
        <h1>Friends</h1>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab() === 'all'" (click)="activeTab.set('all')">
          All Friends <span class="count">{{ friendCount() }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'requests'" (click)="activeTab.set('requests')">
          Friend Requests <span class="count badge">{{ requestCount() }}</span>
        </button>
        <button class="tab" [class.active]="activeTab() === 'suggestions'" (click)="activeTab.set('suggestions')">
          Suggestions
        </button>
      </div>

      <!-- Search -->
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" placeholder="Search friends...">
      </div>

      <!-- Friends Grid -->
      <div class="friends-grid">
        @for (friend of filteredFriends(); track friend.id) {
          <div class="friend-card">
            <div class="friend-avatar">
              @if (friend.avatarUrl) {
                <img [src]="friend.avatarUrl" [alt]="friend.firstName">
              } @else {
                <span>{{ friend.firstName.charAt(0) }}{{ friend.lastName.charAt(0) }}</span>
              }
            </div>
            <div class="friend-info">
              <a [routerLink]="['/profile', friend.id]" class="friend-name">
                {{ friend.firstName }} {{ friend.lastName }}
              </a>
              <span class="mutual-friends">{{ friend.mutualFriends }} mutual friends</span>
            </div>
            <div class="friend-actions">
              @if (activeTab() === 'requests') {
                <button class="action-btn primary" (click)="acceptRequest(friend)">Confirm</button>
                <button class="action-btn secondary" (click)="declineRequest(friend)">Delete</button>
              } @else if (activeTab() === 'suggestions') {
                <button class="action-btn primary" (click)="sendRequest(friend)">Add Friend</button>
                <button class="action-btn secondary" (click)="removeSuggestion(friend)">Remove</button>
              } @else {
                <button class="action-btn secondary" (click)="unfriend(friend)">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  Friends
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .friends-page { padding: 1rem 0; }
    
    .page-header {
      margin-bottom: 1.5rem;
      h1 { margin: 0; font-size: 1.5rem; }
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border: none;
      background: #e4e6eb;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      
      .count {
        font-size: 0.85rem;
        color: #65676b;
        
        &.badge {
          background: #e41e3f;
          color: #fff;
          padding: 0.125rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
        }
      }
      
      &.active { background: #e7f3ff; color: #1877f2; }
      &:hover:not(.active) { background: #d8dadf; }
    }
    
    .search-box {
      display: flex;
      align-items: center;
      background: #f0f2f5;
      border-radius: 20px;
      padding: 0 1rem;
      margin-bottom: 1.5rem;
      
      svg { width: 20px; height: 20px; color: #65676b; }
      
      input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 0.625rem;
        font-size: 0.95rem;
        outline: none;
      }
    }
    
    .friends-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .friend-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #fff;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .friend-avatar {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.5rem;
      flex-shrink: 0;
      overflow: hidden;
      
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    
    .friend-info {
      flex: 1;
      min-width: 0;
      
      .friend-name {
        display: block;
        font-weight: 600;
        font-size: 1rem;
        color: #050505;
        text-decoration: none;
        
        &:hover { text-decoration: underline; }
      }
      
      .mutual-friends {
        font-size: 0.85rem;
        color: #65676b;
      }
    }
    
    .friend-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      
      svg { width: 18px; height: 18px; }
      
      &.primary {
        background: #1877f2;
        color: #fff;
        &:hover { background: #166fe5; }
      }
      
      &.secondary {
        background: #e4e6eb;
        color: #050505;
        &:hover { background: #d8dadf; }
      }
    }
  `]
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
