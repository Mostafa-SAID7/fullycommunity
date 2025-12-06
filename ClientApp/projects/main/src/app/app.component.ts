import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top.component';
import { ChatAssistantComponent } from './shared/components/chat-assistant/chat-assistant.component';
import { LocalizationService } from './core/services/ui/localization.service';
import { AnimationService } from './core/services/ui/animation.service';
import { slideInAnimation, fadeAnimation, getRouteAnimationData } from './core/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastContainerComponent, ScrollToTopComponent, ChatAssistantComponent],
  // animations: [slideInAnimation, fadeAnimation], // Temporarily disabled to fix double-click issue
  template: `
    <div class="app-layout" [class.rtl]="localization.isRtl()">
      <app-header />
      <main class="main-content">
        <router-outlet #outlet="outlet" />
      </main>
      <app-toast-container />
      <app-scroll-to-top />
      <app-chat-assistant />
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: #f0f2f5;
      transition: all 0.3s ease;
    }
    .main-content {
      min-height: calc(100vh - 56px);
      position: relative;
      overflow: hidden;
      pointer-events: auto;
    }
    .app-layout.rtl {
      direction: rtl;
      text-align: right;
    }
    
    /* Animation support styles */
    .main-content > * {
      display: block;
      width: 100%;
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .main-content {
        animation: none !important;
      }
      .main-content * {
        animation: none !important;
        transition: none !important;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  localization = inject(LocalizationService);
  animationService = inject(AnimationService);

  ngOnInit() {
    this.localization.init();
    
    // Sync animation service with localization
    this.animationService.setRtl(this.localization.isRtl());
  }

  getRouteAnimationData = getRouteAnimationData;
}
