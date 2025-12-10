import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './refresh-button.component.html',
  styleUrl: './refresh-button.component.scss'
})
export class RefreshButtonComponent {
  // Inputs
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  variant = input<'primary' | 'secondary' | 'ghost' | 'success' | 'warning'>('secondary');
  size = input<'sm' | 'md' | 'lg'>('md');
  showText = input<boolean>(true);
  refreshText = input<string>('Refresh');
  loadingText = input<string>('Refreshing...');
  title = input<string>('');
  showStatusIndicator = input<boolean>(false);
  status = input<'success' | 'error' | 'warning' | null>(null);
  lastRefresh = input<Date | null>(null);
  showRotateEffect = input<boolean>(true);

  // Outputs
  refresh = output<void>();

  onRefresh() {
    if (!this.loading() && !this.disabled()) {
      this.refresh.emit();
    }
  }


}