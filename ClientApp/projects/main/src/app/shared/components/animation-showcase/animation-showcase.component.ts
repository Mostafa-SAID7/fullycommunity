import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animation-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 space-y-8 bg-background">
      <h2 class="text-title-large text-primary mb-6">Enhanced Animations & Colors</h2>
      
      <!-- Color Palette -->
      <section class="space-y-4">
        <h3 class="text-title">New Color Palette</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="color-card bg-primary text-white">
            <div class="p-4 rounded-lg">
              <div class="text-sm font-medium">Primary</div>
              <div class="text-xs opacity-80">#FF6900</div>
            </div>
          </div>
          <div class="color-card bg-success text-white">
            <div class="p-4 rounded-lg">
              <div class="text-sm font-medium">Success</div>
              <div class="text-xs opacity-80">#00C853</div>
            </div>
          </div>
          <div class="color-card bg-error text-white">
            <div class="p-4 rounded-lg">
              <div class="text-sm font-medium">Error</div>
              <div class="text-xs opacity-80">#E53935</div>
            </div>
          </div>
          <div class="color-card bg-warning text-white">
            <div class="p-4 rounded-lg">
              <div class="text-sm font-medium">Warning</div>
              <div class="text-xs opacity-80">#FFC107</div>
            </div>
          </div>
          <div class="color-card bg-info text-white">
            <div class="p-4 rounded-lg">
              <div class="text-sm font-medium">Info</div>
              <div class="text-xs opacity-80">#1E88E5</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hover Animations -->
      <section class="space-y-4">
        <h3 class="text-title">Hover Animations</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="demo-card hover-lift">
            <div class="text-sm font-medium">Hover Lift</div>
          </div>
          <div class="demo-card hover-glow">
            <div class="text-sm font-medium">Hover Glow</div>
          </div>
          <div class="demo-card hover-scale">
            <div class="text-sm font-medium">Hover Scale</div>
          </div>
          <div class="demo-card hover-rotate">
            <div class="text-sm font-medium">Hover Rotate</div>
          </div>
        </div>
      </section>

      <!-- Entrance Animations -->
      <section class="space-y-4">
        <h3 class="text-title">Entrance Animations</h3>
        <div class="stagger-children grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="demo-card">
            <div class="text-sm font-medium">Slide Up 1</div>
          </div>
          <div class="demo-card">
            <div class="text-sm font-medium">Slide Up 2</div>
          </div>
          <div class="demo-card">
            <div class="text-sm font-medium">Slide Up 3</div>
          </div>
        </div>
      </section>

      <!-- Interactive Elements -->
      <section class="space-y-4">
        <h3 class="text-title">Interactive Elements</h3>
        <div class="flex flex-wrap gap-4">
          <button class="btn btn-primary interactive-button">
            Primary Button
          </button>
          <button class="btn btn-secondary interactive-button">
            Secondary Button
          </button>
          <div class="interactive-card p-4 bg-white rounded-lg border">
            <div class="text-sm font-medium">Interactive Card</div>
            <div class="text-xs text-secondary-600">Click me!</div>
          </div>
        </div>
      </section>

      <!-- State Animations -->
      <section class="space-y-4">
        <h3 class="text-title">State Animations</h3>
        <div class="flex flex-wrap gap-4">
          <button (click)="triggerSuccess()" class="btn btn-primary">
            Trigger Success
          </button>
          <button (click)="triggerError()" class="btn btn-primary">
            Trigger Error
          </button>
          <button (click)="triggerWarning()" class="btn btn-primary">
            Trigger Warning
          </button>
          <button (click)="triggerInfo()" class="btn btn-primary">
            Trigger Info
          </button>
        </div>
        <div class="demo-card" [class]="currentState">
          <div class="text-sm font-medium">State Animation Demo</div>
          <div class="text-xs">Current state: {{ currentState || 'none' }}</div>
        </div>
      </section>

      <!-- Loading Animations -->
      <section class="space-y-4">
        <h3 class="text-title">Loading Animations</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="demo-card">
            <div class="loading-spinner w-8 h-8 mx-auto mb-2"></div>
            <div class="text-sm">Spinner</div>
          </div>
          <div class="demo-card loading-pulse">
            <div class="text-sm">Pulse Loading</div>
          </div>
          <div class="demo-card">
            <div class="flex justify-center space-x-1 mb-2">
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce-dot"></div>
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce-dot" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-primary rounded-full animate-bounce-dot" style="animation-delay: 0.2s"></div>
            </div>
            <div class="text-sm">Dots</div>
          </div>
          <div class="demo-card">
            <div class="w-full h-4 bg-gray-200 rounded mb-2">
              <div class="h-full bg-primary rounded animate-shimmer"></div>
            </div>
            <div class="text-sm">Shimmer</div>
          </div>
        </div>
      </section>

      <!-- Special Effects -->
      <section class="space-y-4">
        <h3 class="text-title">Special Effects</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="demo-card gradient-animate">
            <div class="text-sm font-medium text-white">Gradient Animation</div>
          </div>
          <div class="demo-card border-animate">
            <div class="text-sm font-medium">Border Animation</div>
          </div>
          <div class="demo-card float-gentle">
            <div class="text-sm font-medium">Floating Element</div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .demo-card {
      @apply p-4 bg-white rounded-lg border text-center cursor-pointer;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .color-card {
      @apply rounded-lg shadow-md;
    }

    .btn {
      @apply px-4 py-2 rounded-md font-medium transition-all duration-200;
    }

    .btn-primary {
      @apply bg-primary text-white hover:bg-primary-hover;
    }

    .btn-secondary {
      @apply bg-secondary-200 text-secondary-800 hover:bg-secondary-300;
    }
  `]
})
export class AnimationShowcaseComponent {
  currentState = '';

  triggerSuccess() {
    this.currentState = 'success-bounce';
    setTimeout(() => this.currentState = '', 1000);
  }

  triggerError() {
    this.currentState = 'error-shake';
    setTimeout(() => this.currentState = '', 1000);
  }

  triggerWarning() {
    this.currentState = 'warning-pulse';
    setTimeout(() => this.currentState = '', 2000);
  }

  triggerInfo() {
    this.currentState = 'info-slide';
    setTimeout(() => this.currentState = '', 1000);
  }
}