import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  colorClass: string;
  hoverColorClass: string;
}

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quick-actions.component.html'
})
export class QuickActionsComponent {
  quickActions: QuickAction[] = [
    {
      id: 'create-post',
      title: 'Create Post',
      description: 'Share your thoughts',
      route: '/community/create-post',
      icon: 'M12 4v16m8-8H4',
      colorClass: 'bg-blue-100 dark:bg-blue-900/30',
      hoverColorClass: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50'
    },
    {
      id: 'ask-question',
      title: 'Ask Question',
      description: 'Get expert help',
      route: '/community/qa/ask',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      colorClass: 'bg-green-100 dark:bg-green-900/30',
      hoverColorClass: 'group-hover:bg-green-200 dark:group-hover:bg-green-900/50'
    },
    {
      id: 'sell-item',
      title: 'Sell Item',
      description: 'List on marketplace',
      route: '/marketplace/create',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      colorClass: 'bg-purple-100 dark:bg-purple-900/30',
      hoverColorClass: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50'
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Join car meets',
      route: '/community/events',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      colorClass: 'bg-orange-100 dark:bg-orange-900/30',
      hoverColorClass: 'group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50'
    }
  ];

  getIconColor(action: QuickAction): string {
    const colorMap: { [key: string]: string } = {
      'create-post': 'text-blue-600 dark:text-blue-400',
      'ask-question': 'text-green-600 dark:text-green-400',
      'sell-item': 'text-purple-600 dark:text-purple-400',
      'find-events': 'text-orange-600 dark:text-orange-400'
    };
    return colorMap[action.id] || 'text-gray-600 dark:text-gray-400';
  }
}