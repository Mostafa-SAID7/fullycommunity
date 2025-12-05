import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ToastComponent } from '../../ui/toast/toast.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2" [class.left-4]="isRtl" [class.right-4]="!isRtl">
      @for (toast of toastService.toasts(); track toast.id) {
        <ui-toast
          [type]="toast.type"
          [title]="toast.title || ''"
          [message]="toast.message"
          [duration]="toast.duration || 5000"
          [closable]="toast.closable !== false"
          [persistent]="toast.persistent || false"
          (closed)="onToastClosed(toast.id)">
        </ui-toast>
      }
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }
    
    .fixed > * {
      pointer-events: auto;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  get isRtl(): boolean {
    return document.documentElement.dir === 'rtl';
  }

  onToastClosed(id: string): void {
    this.toastService.remove(id);
  }
}