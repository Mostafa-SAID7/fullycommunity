import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const videoRoutes: Routes = [
  { path: '', loadComponent: () => import('./video-feed/video-feed.component').then(m => m.VideoFeedComponent) },
  { path: 'trending', loadComponent: () => import('./video-trending/video-trending.component').then(m => m.VideoTrendingComponent) },
  { path: 'watch/:id', loadComponent: () => import('./video-player/video-player.component').then(m => m.VideoPlayerComponent) },
  { path: 'shorts', loadComponent: () => import('./video-shorts/video-shorts.component').then(m => m.VideoShortsComponent) },
  { path: 'channel/:handle', loadComponent: () => import('./channel-profile/channel-profile.component').then(m => m.ChannelProfileComponent) },
  { path: 'live', loadComponent: () => import('./live-streams/live-streams.component').then(m => m.LiveStreamsComponent) },
  { path: 'live/:id', loadComponent: () => import('./live-watch/live-watch.component').then(m => m.LiveWatchComponent) },
  { path: 'saved', loadComponent: () => import('./saved-videos/saved-videos.component').then(m => m.SavedVideosComponent), canActivate: [authGuard] },
  { path: 'subscriptions', loadComponent: () => import('./subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent), canActivate: [authGuard] },
  { path: 'studio', loadComponent: () => import('./creator-studio/creator-studio.component').then(m => m.CreatorStudioComponent), canActivate: [authGuard] },
  { path: 'upload', loadComponent: () => import('./video-upload/video-upload.component').then(m => m.VideoUploadComponent), canActivate: [authGuard] }
];
