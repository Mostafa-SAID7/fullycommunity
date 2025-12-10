import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  badge?: number;
  disabled?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-tab-navigation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          *ngFor="let tab of tabs"
          (click)="selectTab(tab)"
          [disabled]="tab.disabled"
          class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          [ngClass]="{
            'border-primary text-primary': activeTabId === tab.id,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTabId !== tab.id && !tab.disabled
          }">
          <div class="flex items-center gap-2">
            <span *ngIf="tab.icon" class="text-lg">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <span 
              *ngIf="tab.badge !== undefined && tab.badge > 0" 
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              [ngClass]="{
                'bg-primary text-white': activeTabId === tab.id,
                'bg-gray-100 text-gray-900': activeTabId !== tab.id
              }">
              {{ tab.badge }}
            </span>
          </div>
        </button>
      </nav>
    </div>
  `
})
export class TabNavigationComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(tab: Tab) {
    if (tab.disabled) return;
    this.tabChange.emit(tab.id);
  }
}