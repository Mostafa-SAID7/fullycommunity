import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationItem } from '../../../core/interfaces/admin/moderation.interface';

@Component({
  selector: 'app-moderation-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border transition-all hover:shadow-md"
         [ngClass]="isHighPriority ? 'border-red-300 bg-red-50/30' : 'border-gray-200'">
      
      <!-- Item Header -->
      <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <span *ngIf="item.priority !== 'normal'" 
                class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase"
                [ngClass]="{
                  'bg-red-100 text-red-700': item.priority === 'high' || item.priority === 'urgent',
                  'bg-orange-100 text-orange-700': item.priority === 'low'
                }">
            {{ item.priority }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="getReasonClass(item.reportReason)">
            {{ item.reportReason }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {{ item.contentType }}
          </span>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                [ngClass]="{
                  'bg-yellow-100 text-yellow-700': item.status === 'pending',
                  'bg-green-100 text-green-700': item.status === 'approved',
                  'bg-red-100 text-red-700': item.status === 'rejected',
                  'bg-gray-100 text-gray-700': item.status === 'dismissed'
                }">
            {{ item.status }}
          </span>
          <span class="text-gray-500">{{ item.reportedAt | date:'short' }}</span>
        </div>
      </div>

      <!-- Item Body -->
      <div class="p-4 space-y-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ item.contentTitle }}</h3>
          <p class="text-sm text-gray-500">ID: {{ item.contentId }}</p>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex items-start gap-2">
            <span class="font-medium text-gray-700 min-w-[100px]">Reported by:</span>
            <span class="text-gray-900">{{ item.reportedBy }}</span>
          </div>
          <div *ngIf="item.moderatorNotes" class="flex items-start gap-2">
            <span class="font-medium text-gray-700 min-w-[100px]">Notes:</span>
            <span class="text-gray-900">{{ item.moderatorNotes }}</span>
          </div>
        </div>
      </div>

      <!-- Item Actions -->
      <div *ngIf="item.status === 'pending'" 
           class="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
        <button 
          (click)="approve.emit(item)" 
          title="Content is OK"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
          ✓ Approve
        </button>
        <button 
          (click)="reject.emit(item)" 
          title="Remove content"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
          ✕ Remove
        </button>
        <button 
          (click)="dismiss.emit(item)" 
          title="Dismiss report"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm">
          Dismiss
        </button>
        <button 
          (click)="more.emit(item)" 
          title="More options"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
          ⋯ More
        </button>
      </div>

      <!-- Resolved Status -->
      <div *ngIf="item.status !== 'pending'" 
           class="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm">
        <span class="font-medium text-gray-700">{{ item.status | titlecase }}</span>
        <span *ngIf="item.moderatedAt" class="text-gray-500">{{ item.moderatedAt | date:'short' }}</span>
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

  get isHighPriority(): boolean {
    return this.item.priority === 'high' || this.item.priority === 'urgent';
  }

  getReasonClass(reason: string): string {
    const reasonMap: { [key: string]: string } = {
      'spam': 'bg-orange-100 text-orange-700',
      'harassment': 'bg-red-100 text-red-700',
      'inappropriate': 'bg-purple-100 text-purple-700',
      'misinformation': 'bg-yellow-100 text-yellow-700',
      'copyright': 'bg-blue-100 text-blue-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return reasonMap[reason.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }
}
