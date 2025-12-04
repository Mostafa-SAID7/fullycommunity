import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../ui';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="text-center py-12 px-6">
      <!-- Icon/Illustration -->
      <div class="mb-6">
        <div *ngIf="icon" class="text-6xl mb-4" [innerHTML]="icon"></div>
        <img *ngIf="illustration" [src]="illustration" [alt]="title" class="mx-auto max-w-xs opacity-75">
      </div>

      <!-- Content -->
      <div class="max-w-md mx-auto">
        <h3 class="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
          {{ title }}
        </h3>
        
        <p class="text-secondary-600 dark:text-secondary-400 mb-6">
          {{ description }}
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center" *ngIf="primaryAction || secondaryAction">
          <ui-button 
            *ngIf="primaryAction"
            [variant]="primaryVariant"
            [size]="buttonSize"
            (clicked)="onPrimaryAction()">
            {{ primaryAction }}
          </ui-button>
          
          <ui-button 
            *ngIf="secondaryAction"
            variant="outline"
            [size]="buttonSize"
            (clicked)="onSecondaryAction()">
            {{ secondaryAction }}
          </ui-button>
        </div>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'No items found';
  @Input() description = 'There are no items to display at the moment.';
  @Input() icon = '';
  @Input() illustration = '';
  @Input() primaryAction = '';
  @Input() secondaryAction = '';
  @Input() primaryVariant: 'primary' | 'secondary' | 'accent' = 'primary';
  @Input() buttonSize: 'sm' | 'md' | 'lg' = 'md';
  
  @Output() primaryClicked = new EventEmitter<void>();
  @Output() secondaryClicked = new EventEmitter<void>();

  onPrimaryAction() {
    this.primaryClicked.emit();
  }

  onSecondaryAction() {
    this.secondaryClicked.emit();
  }
}