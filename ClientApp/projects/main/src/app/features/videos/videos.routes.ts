import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const videoRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./video-layout/video-layout.component').then(m => m.VideoLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./video-feed/video-feed.component').then(m => m.VideoFeedComponent) },
      { path: 'trending', loadComponent: () => import('./video-trending/video-trending.component').then(m => m.VideoTrendingComponent) },
      { path: 'shorts', loadComponent: () => import('./video-shorts/video-shorts.component').then(m => m.VideoShortsComponent) },
      { path: 'live', loadComponent: () => import('./live-streams/live-streams.component').then(m => m.LiveStreamsComponent) },
      { path: 'subscriptions', loadComponent: () => import('./subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent), canActivate: [authGuard] },
      { path: 'library', loadComponent: () => import('./video-library/video-library.component').then(m => m.VideoLibraryComponent), canActivate: [authGuard] },
      { path: 'history', loadComponent: () => import('./watch-history/watch-history.component').then(m => m.WatchHistoryComponent), canActivate: [authGuard] },
      { path: 'saved', loadComponent: () => import('./saved-videos/saved-videos.component').then(m => m.SavedVideosComponent), canActivate: [authGuard] },
      { path: 'channel/me', loadComponent: () => import('./my-channel/my-channel.component').then(m => m.MyChannelComponent), canActivate: [authGuard] },
      { path: 'studio', loadComponent: () => import('./creator-studio/creator-studio.component').then(m => m.CreatorStudioComponent), canActivate: [authGuard] },
      { path: 'upload', loadComponent: () => import('./video-upload/video-upload.component').then(m => m.VideoUploadComponent), canActivate: [authGuard] }
    ]
  },
  // Full-screen routes (no sidebar)
  { path: 'watch/:id', loadComponent: () => import('./video-player/video-player.component').then(m => m.VideoPlayerComponent) },
  { path: 'live/:id', loadComponent: () => import('./live-watch/live-watch.component').then(m => m.LiveWatchComponent) },
  { path: 'channel/:handle', loadComponent: () => import('./channel-profile/channel-profile.component').then(m => m.ChannelProfileComponent) }
];
