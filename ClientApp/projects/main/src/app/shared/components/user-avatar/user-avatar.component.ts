import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (avatarUrl()) {
    <img 
      [src]="avatarUrl()" 
      [alt]="name()"
      [class]="avatarClasses()"
      class="object-cover" />
    } @else {
    <div 
      [class]="avatarClasses()"
      class="bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold">
      {{ initials() }}
    </div>
    }
  `
})
export class UserAvatarComponent {
  name = input.required<string>();
  avatarUrl = input<string | null | undefined>();
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  customClass = input<string>('');

  initials = computed(() => {
    const names = this.name().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.name().substring(0, 2).toUpperCase();
  });

  avatarClasses = computed(() => {
    const sizeClasses = {
      xs: 'w-5 h-5 text-[8px]',
      sm: 'w-6 h-6 text-[10px]',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
      xl: 'w-12 h-12 text-lg'
    };

    return `rounded-full ${sizeClasses[this.size()]} ${this.customClass()}`;
  });
}
