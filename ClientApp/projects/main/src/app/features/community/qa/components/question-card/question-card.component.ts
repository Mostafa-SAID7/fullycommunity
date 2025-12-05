import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface QuestionListItem {
  id: string;
  title: string;
  content?: string;
  slug: string;
  status: string;
  tags: string[];
  viewCount: number;
  answerCount: number;
  voteCount: number;
  hasAcceptedAnswer: boolean;
  bountyPoints?: number;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    isVerified: boolean;
    reputation: number;
  };
}

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fluent-card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border-l-4 border-transparent"
         [style.--hover-border-color]="'var(--color-primary)'"
         [routerLink]="['/community/qa', question().slug]">
      <div class="flex gap-6">
        <!-- Enhanced Stats Column -->
        <div class="flex flex-col gap-4 shrink-0 min-w-[100px]">
          <!-- Votes -->
          <!-- Commented out content -->
        </div>

        <!-- Enhanced Content -->
        <div class="flex-1 min-w-0">
          <!-- Question Header -->
          
        </div>
      </div>
    </div>
  `
})
export class QuestionCardComponent {
  question = input.required<QuestionListItem>();

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  }

  isHotQuestion(question: QuestionListItem): boolean {
    const ageInHours = (Date.now() - new Date(question.createdAt).getTime()) / (1000 * 60 * 60);
    const score = (question.voteCount * 2 + question.answerCount * 3 + question.viewCount * 0.1) / Math.pow(ageInHours + 2, 1.5);
    return score > 10;
  }

  tagClicked(tag: string) {
    // Emit event or handle tag click
    console.log('Tag clicked:', tag);
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }
}