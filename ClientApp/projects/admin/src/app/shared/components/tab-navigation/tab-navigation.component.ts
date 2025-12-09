import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  badge?: number;
}

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex gap-1">
      <button 
        *ngFor="let tab of tabs"
        class="px-4 py-2 rounded-lg font-medium text-sm transition-all"
        [ngClass]="activeTabId === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'"
        (click)="onTabChange(tab.id)">
        {{ tab.label }}
        <span *ngIf="tab.badge !== undefined && tab.badge > 0" 
              class="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
              [ngClass]="activeTabId === tab.id ? 'bg-white text-primary' : 'bg-red-100 text-red-600'">
          {{ tab.badge }}
        </span>
      </button>
    </div>
  `
})
export class TabNavigationComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string = '';
  @Output() tabChange = new EventEmitter<string>();

  onTabChange(tabId: string): void {
    this.tabChange.emit(tabId);
  }
}
