import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default style for enter and leave
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0.8)',
      }),
    ], { optional: true }),
    
    // Animate the new page in
    query(':enter', [
      animate('600ms ease', style({ opacity: 1, transform: 'scale(1)' })),
    ], { optional: true })
  ]),
]);

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    
    query(':leave', [
      animate('300ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),
    
    query(':enter', [
      animate('300ms ease-in', style({ opacity: 1 }))
    ], { optional: true }),
  ]),
]);

export const slideRightAnimation = trigger('slideRightAnimation', [
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ left: '100%' })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('400ms ease-in-out', style({ left: '-100%' }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms ease-in-out', style({ left: '0%' }))
      ], { optional: true }),
    ]),
  ]),
]);

export const slideLeftAnimation = trigger('slideLeftAnimation', [
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ left: '-100%' })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('400ms ease-in-out', style({ left: '100%' }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms ease-in-out', style({ left: '0%' }))
      ], { optional: true }),
    ]),
  ]),
]);

export const scaleAnimation = trigger('scaleAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'scale(0.8) translateY(20px)'
      })
    ], { optional: true }),
    
    query(':leave', [
      animate('200ms ease-in', style({ 
        opacity: 0,
        transform: 'scale(1.1) translateY(-20px)'
      }))
    ], { optional: true }),
    
    query(':enter', [
      animate('400ms 200ms ease-out', style({ 
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      }))
    ], { optional: true }),
  ]),
]);

export const bounceAnimation = trigger('bounceAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        opacity: 0,
        transform: 'translateY(100px)'
      })
    ], { optional: true }),
    
    query(':leave', [
      animate('300ms ease-in', style({ 
        opacity: 0,
        transform: 'translateY(-100px)'
      }))
    ], { optional: true }),
    
    query(':enter', [
      animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
        keyframes([
          style({ opacity: 0, transform: 'translateY(100px)', offset: 0 }),
          style({ opacity: 0.5, transform: 'translateY(-20px)', offset: 0.3 }),
          style({ opacity: 0.8, transform: 'translateY(10px)', offset: 0.7 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
        ])
      )
    ], { optional: true }),
  ]),
]);

// RTL-aware animations
export const slideRtlAnimation = trigger('slideRtlAnimation', [
  transition('* => *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ], { optional: true }),
    
    query(':enter', [
      style({ 
        transform: 'translateX(var(--slide-direction, 100%))'
      })
    ], { optional: true }),
    
    group([
      query(':leave', [
        animate('400ms ease-in-out', style({ 
          transform: 'translateX(var(--slide-direction-reverse, -100%))'
        }))
      ], { optional: true }),
      
      query(':enter', [
        animate('400ms ease-in-out', style({ 
          transform: 'translateX(0)'
        }))
      ], { optional: true }),
    ]),
  ]),
]);

// Page-specific animations
export const pageAnimations = {
  home: 'HomePage',
  community: 'CommunityPage',
  marketplace: 'MarketplacePage',
  services: 'ServicesPage',
  podcasts: 'PodcastsPage',
  videos: 'VideosPage',
  profile: 'ProfilePage',
  settings: 'SettingsPage',
};

export function getRouteAnimationData(outlet: any) {
  return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
}