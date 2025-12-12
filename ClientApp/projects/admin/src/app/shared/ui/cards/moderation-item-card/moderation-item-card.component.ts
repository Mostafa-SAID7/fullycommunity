import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationItem } from '../../../../core/interfaces/admin/moderation.interface';

@Component({
  selector: 'app-moderation-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderation-item-card.component.html',
  styleUrl: './moderation-item-card.component.scss'
})
export class ModerationItemCardComponent {
  @Input() item!: ModerationItem;
  @Output() approve = new EventEmitter<ModerationItem>();
  @Output() reject = new EventEmitter<ModerationItem>();
  @Output() dismiss = new EventEmitter<ModerationItem>();
  @Output() more = new EventEmitter<ModerationItem>();

  getContentTypeClass(): string {
    const classes: { [key: string]: string } = {
      post: 'type-post',
      comment: 'type-comment',
      review: 'type-review',
      video: 'type-video',
      guide: 'type-guide'
    };
    return classes[this.item.contentType as string] || 'type-post';
  }

  getPriorityClass(): string {
    const classes: { [key: string]: string } = {
      low: 'priority-low',
      normal: 'priority-normal',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    return classes[this.item.priority as string] || 'priority-normal';
  }
}