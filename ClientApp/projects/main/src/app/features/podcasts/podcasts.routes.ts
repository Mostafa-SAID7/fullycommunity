import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const podcastRoutes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./podcast-home/podcast-home.component').then(m => m.PodcastHomeComponent) 
  },
  { 
    path: 'browse', 
    loadComponent: () => import('./podcast-browse/podcast-browse.component').then(m => m.PodcastBrowseComponent) 
  },
  { 
    path: 'library', 
    loadComponent: () => import('./podcast-library/podcast-library.component').then(m => m.PodcastLibraryComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'show/:slug', 
    loadComponent: () => import('./podcast-detail/podcast-detail.component').then(m => m.PodcastDetailComponent) 
  },
  // Episode player route - TODO: Create episode player component
  // { 
  //   path: 'episode/:podcastId/:episodeId', 
  //   loadComponent: () => import('./episode-player/episode-player.component').then(m => m.EpisodePlayerComponent) 
  // },
  { 
    path: 'create', 
    loadComponent: () => import('./podcast-create/podcast-create.component').then(m => m.PodcastCreateComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'manage/:id', 
    loadComponent: () => import('./podcast-manage/podcast-manage.component').then(m => m.PodcastManageComponent),
    canActivate: [authGuard]
  }
];
