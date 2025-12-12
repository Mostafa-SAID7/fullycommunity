import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = 'Avatar';
  @Input() name?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() shape: 'circle' | 'square' | 'rounded' = 'circle';
  @Input() status?: 'online' | 'offline' | 'away' | 'busy';
  @Input() showStatus = false;
  @Input() clickable = false;
  @Input() loading = false;
  @Input() fallbackIcon = 'user';
  
  @Output() click = new EventEmitter<void>();

  imageError = false;

  onImageError() {
    this.imageError = true;
  }

  onImageLoad() {
    this.imageError = false;
  }

  onClick() {
    if (this.clickable && !this.loading) {
      this.click.emit();
    }
  }

  getInitials(): string {
    if (!this.name) return '';
    
    const names = this.name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  getContainerClasses(): string {
    const classes = ['avatar-container'];
    
    classes.push(`avatar-${this.size}`);
    classes.push(`avatar-${this.shape}`);
    
    if (this.clickable) classes.push('avatar-clickable');
    if (this.loading) classes.push('avatar-loading');
    if (this.showStatus && this.status) classes.push('avatar-with-status');
    
    return classes.join(' ');
  }

  getStatusClasses(): string {
    const classes = ['avatar-status'];
    
    if (this.status) {
      classes.push(`status-${this.status}`);
    }
    
    return classes.join(' ');
  }

  getFallbackIcon(): string {
    switch (this.fallbackIcon) {
      case 'user':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'admin':
        return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
      case 'guest':
        return 'M8.228 9c.549-1.165 2.03-2 3.772-2 1.742 0 3.223.835 3.772 2H8.228zM15 11a3 3 0 11-6 0 3 3 0 016 0z';
      default:
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
    }
  }
}