import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SiteSettingItem {
  key: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'text' | 'number';
  value: any;
  options?: { label: string; value: any }[];
  disabled?: boolean;
  category?: string;
}

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './site-settings.component.html',
  styleUrl: './site-settings.component.scss'
})
export class SiteSettingsComponent {
  @Input() settings: SiteSettingItem[] = [];
  @Input() title = 'Site Settings';
  @Input() description?: string;
  @Input() loading = false;
  @Input() readonly = false;
  
  @Output() settingChange = new EventEmitter<{ key: string; value: any }>();
  @Output() save = new EventEmitter<SiteSettingItem[]>();
  @Output() reset = new EventEmitter<void>();

  onSettingChange(setting: SiteSettingItem, value: any) {
    if (setting.disabled || this.readonly) return;
    
    setting.value = value;
    this.settingChange.emit({ key: setting.key, value });
  }

  onSave() {
    if (this.readonly) return;
    this.save.emit(this.settings);
  }

  onReset() {
    if (this.readonly) return;
    this.reset.emit();
  }

  getSettingsByCategory(): { [category: string]: SiteSettingItem[] } {
    const grouped: { [category: string]: SiteSettingItem[] } = {};
    
    this.settings.forEach(setting => {
      const category = setting.category || 'General';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(setting);
    });
    
    return grouped;
  }

  getCategories(): string[] {
    return Object.keys(this.getSettingsByCategory());
  }
}