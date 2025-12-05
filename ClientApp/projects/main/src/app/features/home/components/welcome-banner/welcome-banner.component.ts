import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/services/auth/auth.service';

export interface CommunityStats {
  members: number;
  posts: number;
  experts: number;
  garages: number;
}

@Component({
  selector: 'app-welcome-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-banner.component.html'
})
export class WelcomeBannerComponent {
  @Input() user: User | null = null;
  @Input() stats: CommunityStats = {
    members: 0,
    posts: 0,
    experts: 0,
    garages: 0
  };

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}