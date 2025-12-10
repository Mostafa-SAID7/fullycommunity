import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationItem } from '../../../core/interfaces/admin/moderation.interface';

@Component({
  selector: 'app-moderation-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getContentTypeClass()">
              {{ item.contentType | titlecase }}
            </span>
            <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getPriorityClass()">
              {{ item.priority | titlecase }}
            </span>
          </div>
          <h3 class="font-semibold text-gray-900 mb-2">{{ item.contentTitle }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.contentPreview }}</p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span>Reported by: {{ item.reporterName }}</span>
            <span>{{ item.reportedAt | date:'short' }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-2 ml-4">
          <button 
            (click)="approve.emit(item)"
            class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            Approve
          </button>
          <button 
            (click)="reject.emit(item)"
            class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
            Reject
          </button>
          <button 
            (click)="dismiss.emit(item)"
            class="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
            Dismiss
          </button>
          <button 
            (click)="more.emit(item)"
            class="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            More
          </button>
        </div>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-sm font-medium text-red-800">Report Reason</span>
        </div>
        <p class="text-sm text-red-700">{{ item.reportReason }}</p>
      </div>
    </div>
  `
})
export class ModerationItemCardComponent {
  @Input() item!: ModerationItem;
  @Output() approve = new EventEmitter<ModerationItem>();
  @Output() reject = new EventEmitter<ModerationItem>();
  @Output() dismiss = new EventEmitter<ModerationItem>();
  @Output() more = new EventEmitter<ModerationItem>();

  getContentTypeClass(): string {
    const classes = {
      post: 'bg-blue-100 text-blue-800',
      comment: 'bg-green-100 text-green-800',
      review: 'bg-purple-100 text-purple-800',
      video: 'bg-red-100 text-red-800',
      guide: 'bg-yellow-100 text-yellow-800'
    };
    return classes[this.item.contentType] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(): string {
    const classes = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classes[this.item.priority] || 'bg-gray-100 text-gray-800';
  }
}