import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { LocalizationService } from './core/services/localization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent],
  template: `
    <div class="app-layout" [class.rtl]="localization.isRtl()">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-toast />
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: #f0f2f5;
    }
    .main-content {
      min-height: calc(100vh - 56px);
    }
    .app-layout.rtl {
      direction: rtl;
      text-align: right;
    }
  `]
})
export class AppComponent implements OnInit {
  localization = inject(LocalizationService);

  ngOnInit() {
    this.localization.init();
  }
}
