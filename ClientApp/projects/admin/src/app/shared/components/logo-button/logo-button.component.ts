import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="containerClasses"
      class="relative inline-flex items-center justify-center bg-gradient-to-br from-primary to-primary-hover rounded-3xl transform transition-all duration-300 cursor-pointer group"
      [style.width.px]="size"
      [style.height.px]="size"
    >
      <!-- 3D Effect Layers -->
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent"></div>
      
      <!-- Shine Effect -->
      <div class="absolute inset-0 rounded-3xl overflow-hidden">
        <div class="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out]"></div>
      </div>
      
      <!-- Logo Text -->
      <span 
        [class]="textClasses"
        class="relative z-10 font-black text-white tracking-tighter font-sans select-none"
        [style.fontSize.px]="fontSize"
        
      >
        {{ text }}
      </span>
      
      <!-- Bottom Shadow for 3D depth -->
      <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-primary/20 blur-xl rounded-full"></div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .group {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .group:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 
        0 0 50px rgba(141, 7, 7, 0.8),
        0 0 70px rgba(141, 7, 7, 0.5),
        0 0 100px rgba(141, 7, 7, 0.3),
        0 15px 35px -5px rgba(141, 7, 7, 0.4) !important;
    }
    
    .group:active {
      transform: translateY(0px) scale(0.98);
      box-shadow: 
        0 0 30px rgba(141, 7, 7, 0.6),
        0 0 50px rgba(141, 7, 7, 0.4),
        0 0 70px rgba(141, 7, 7, 0.2),
        0 5px 15px -5px rgba(141, 7, 7, 0.3) !important;
    }
  `]
})
export class LogoButtonComponent {
  @Input() text: string = 'CC';
  @Input() size: number = 96;
  @Input() fontSize: number = 48;
  @Input() containerClasses: string = '';
  @Input() textClasses: string = '';
}
