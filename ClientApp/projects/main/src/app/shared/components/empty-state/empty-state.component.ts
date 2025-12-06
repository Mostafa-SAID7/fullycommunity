import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, ButtonVariant } from '../../ui/button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="text-center py-12 px-6">
      <!-- Icon/Illustration -->
      <div class="mb-6">
        <div *ngIf="icon && !isSvg(icon)" class="text-6xl mb-4 text-gray-400 dark:text-gray-500">
            <!-- Simple material icon fallback or text icon -->
            <span *ngIf="icon === 'error'">⚠️</span>
            <span *ngIf="icon === 'questions'">❓</span>
            <span *ngIf="icon !== 'error' && icon !== 'questions'" [innerHTML]="icon"></span>
        </div>
        <img *ngIf="illustration" [src]="illustration" [alt]="title" class="mx-auto max-w-xs opacity-75">
      </div>

      <!-- Content -->
      <div class="max-w-md mx-auto">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ title }}
        </h3>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ description }}
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center" *ngIf="resolvePrimaryAction() || resolveSecondaryAction()">
          <ui-button 
            *ngIf="resolvePrimaryAction()"
            [variant]="resolvePrimaryVariant()"
            [size]="buttonSize"
            [icon]="actionIcon"
            (clicked)="onPrimaryAction()">
            {{ resolvePrimaryAction() }}
          </ui-button>
          
          <ui-button 
            *ngIf="resolveSecondaryAction()"
            variant="outline"
            [size]="buttonSize"
            (clicked)="onSecondaryAction()">
            {{ resolveSecondaryAction() }}
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

  // Legacy inputs
  @Input() primaryAction = '';
  @Input() secondaryAction = '';
  @Input() primaryVariant: ButtonVariant = 'primary';

  // New inputs for QA module compatibility
  @Input() actionText = '';
  @Input() actionIcon = '';
  @Input() variant: 'error' | 'default' = 'default';

  @Input() buttonSize: 'sm' | 'md' | 'lg' = 'md';

  @Output() primaryClicked = new EventEmitter<void>();
  @Output() secondaryClicked = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<void>();

  resolvePrimaryAction(): string {
    return this.actionText || this.primaryAction;
  }

  resolveSecondaryAction(): string {
    return this.secondaryAction;
  }

  resolvePrimaryVariant(): ButtonVariant {
    if (this.variant === 'error') return 'error';
    return this.primaryVariant;
  }

  onPrimaryAction() {
    if (this.actionText) {
      this.actionClicked.emit();
    } else {
      this.primaryClicked.emit();
    }
  }

  onSecondaryAction() {
    this.secondaryClicked.emit();
  }

  isSvg(icon: string): boolean {
    return icon.includes('<svg');
  }
}