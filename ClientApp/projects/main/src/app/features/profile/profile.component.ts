import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommunityService, Post } from '../../core/services/community/community.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private communityService = inject(CommunityService);
  private route = inject(ActivatedRoute);

  user = this.authService.currentUser;
  profileUser = signal<any>(null);
  userPosts = signal<Post[]>([]);
  activeTab = signal<'posts' | 'about' | 'friends' | 'photos'>('posts');
  isOwnProfile = signal(true);
  isEditing = signal(false);
  loading = signal(true);

  editForm = {
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    location: ''
  };

  stats = signal({ posts: 0, friends: 0, followers: 0 });

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId && userId !== this.user()?.id) {
      this.isOwnProfile.set(false);
      this.loadUserProfile(userId);
    } else {
      this.loadOwnProfile();
    }
  }

  loadOwnProfile() {
    const u = this.user();
    if (u) {
      this.profileUser.set(u);
      this.editForm = {
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phoneNumber || '',
        bio: '',
        location: ''
      };
      this.loadUserPosts(u.id);
    }
    this.loading.set(false);
  }

  loadUserProfile(userId: string) {
    // In real app, fetch user profile from API
    this.loading.set(false);
  }

  loadUserPosts(userId: string) {
    // Load user's posts - mock for now
    this.stats.set({ posts: 12, friends: 156, followers: 89 });
  }

  setTab(tab: 'posts' | 'about' | 'friends' | 'photos') {
    this.activeTab.set(tab);
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  saveProfile() {
    this.authService.updateProfile({
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      phoneNumber: this.editForm.phone
    }).subscribe({
      next: () => this.isEditing.set(false)
    });
  }

  getUserInitials(): string {
    const u = this.profileUser();
    if (!u) return 'U';
    return ((u.firstName?.charAt(0) || '') + (u.lastName?.charAt(0) || '')).toUpperCase() || 'U';
  }
}
