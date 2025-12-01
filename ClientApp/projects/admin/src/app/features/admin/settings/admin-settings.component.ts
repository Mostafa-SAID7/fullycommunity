import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-settings">
      <h1>System Settings</h1>
      <div class="settings-sections">
        <section class="settings-section">
          <h2>General Settings</h2>
          <div class="setting-item">
            <label>Site Name</label>
            <input type="text" value="CommunityCar" class="setting-input">
          </div>
          <div class="setting-item">
            <label>Maintenance Mode</label>
            <input type="checkbox" class="setting-checkbox">
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .admin-settings { max-width: 800px; }
    .settings-section { background: white; padding: 1.5rem; margin: 1rem 0; border-radius: 8px; }
    .setting-item { margin: 1rem 0; }
    .setting-input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
  `]
})
export class AdminSettingsComponent {}