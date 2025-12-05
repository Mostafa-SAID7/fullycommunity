import { Pipe, PipeTransform, inject } from '@angular/core';
import { LocalizationService } from '../../core/services/ui/localization.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  private localization = inject(LocalizationService);

  transform(key: string, params?: Record<string, string | number>): string {
    return this.localization.t(key, params);
  }
}
