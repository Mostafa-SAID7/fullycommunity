import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() name = '';
  @Input() size: AvatarSize = 'md';
  @Input() rounded = true;
  @Input() status: 'online' | 'offline' | 'away' | 'busy' | '' = '';

  get avatarClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-segoe font-medium text-white bg-gradient-to-br from-primary to-primary-600 relative overflow-hidden';
    
    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-20 h-20 text-xl'
    };

    const roundedClass = this.rounded ? 'rounded-full' : 'rounded-fluent';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${roundedClass}`.trim();
  }

  get statusClasses(): string {
    const baseClasses = 'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-background-dark';
    
    const sizeClasses = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5'
    };

    const statusColors = {
      online: 'bg-success',
      offline: 'bg-secondary-400',
      away: 'bg-warning',
      busy: 'bg-error'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${statusColors[this.status as keyof typeof statusColors] || ''}`.trim();
  }

  get initials(): string {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get displayAlt(): string {
    return this.alt || this.name || 'Avatar';
  }
}