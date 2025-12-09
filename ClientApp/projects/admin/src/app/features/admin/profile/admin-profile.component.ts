import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html'
})
export class AdminProfileComponent implements OnInit {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  activeTab = signal<'profile' | 'security' | 'activity'>('profile');

  // Profile form
  firstName = '';
  lastName = '';
  phone = '';
  bio = '';

  // Password form
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Avatar
  uploadingAvatar = signal(false);
  showAvatarModal = signal(false);

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.firstName = user.firstName || '';
      this.lastName = user.lastName || '';
      this.phone = user.phoneNumber || '';
    }
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'A';
  }

  getRoleBadgeClass(role: string): string {
    const classes: Record<string, string> = {
      'SuperAdmin': 'badge-purple',
      'Admin': 'badge-blue',
      'Moderator': 'badge-green',
      'UserAdmin': 'badge-orange',
      'ContentAdmin': 'badge-teal'
    };
    return classes[role] || 'badge-gray';
  }

  setActiveTab(tab: 'profile' | 'security' | 'activity') {
    this.activeTab.set(tab);
    this.clearMessages();
  }

  clearMessages() {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveProfile() {
    this.clearMessages();
    this.saving.set(true);
    
    this.authService.updateProfile({
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phone
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Profile updated successfully!');
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to update profile');
      }
    });
  }

  changePassword() {
    this.clearMessages();
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters');
      return;
    }

    this.saving.set(true);
    // TODO: Implement password change API call
    setTimeout(() => {
      this.saving.set(false);
      this.successMessage.set('Password changed successfully!');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }, 1000);
  }

  onAvatarSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('File size must be less than 5MB');
      return;
    }

    this.clearMessages();
    this.uploadingAvatar.set(true);

    this.authService.uploadAvatar(file).subscribe({
      next: () => {
        this.uploadingAvatar.set(false);
        this.successMessage.set('Avatar updated successfully!');
      },
      error: (err) => {
        this.uploadingAvatar.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to upload avatar');
      }
    });
  }

  hasAvatar(): boolean {
    return !!this.currentUser()?.avatarUrl;
  }

  openAvatarModal() {
    this.showAvatarModal.set(true);
  }

  closeAvatarModal() {
    this.showAvatarModal.set(false);
  }

  triggerFileInput() {
    const input = document.getElementById('avatar-file-input') as HTMLInputElement;
    input?.click();
    this.closeAvatarModal();
  }

  removeAvatar() {
    // For now, just clear the avatar URL locally
    // TODO: Add API endpoint to remove avatar
    const user = this.currentUser();
    if (user) {
      const updated = { ...user, avatarUrl: undefined };
      localStorage.setItem('admin_user', JSON.stringify(updated));
      this.authService.currentUser.set(updated);
      this.successMessage.set('Avatar removed');
    }
    this.closeAvatarModal();
  }
}
