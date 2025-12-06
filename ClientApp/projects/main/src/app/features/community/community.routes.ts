import { Routes } from '@angular/router';

export const communityRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./community-layout/community-layout.component').then(m => m.CommunityLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./feed/feed.component').then(m => m.FeedComponent) },
      { path: 'post/:id', loadComponent: () => import('./post-detail/post-detail.component').then(m => m.PostDetailComponent) },
      { path: 'groups', loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent) },
      { path: 'events', loadComponent: () => import('./events/events.component').then(m => m.EventsComponent) },
      { path: 'friends', loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent) },
      { path: 'saved', loadComponent: () => import('./saved/saved.component').then(m => m.SavedComponent) },
      { path: 'qa', loadComponent: () => import('./qa/qa.component').then(m => m.QAComponent) },
      { path: 'qa/ask', loadComponent: () => import('./qa/ask-question/ask-question.component').then(m => m.AskQuestionComponent) },
      { path: 'qa/:id', loadComponent: () => import('./qa/question-detail/question-detail.component').then(m => m.QuestionDetailComponent) },
      { path: 'guides', loadComponent: () => import('./guides/guides.component').then(m => m.GuidesComponent) },
      { path: 'guides/:slug', loadComponent: () => import('./guides/guide-detail.component').then(m => m.GuideDetailComponent) },
      { path: 'reviews', loadComponent: () => import('./reviews/reviews.component').then(m => m.ReviewsComponent) },
      { path: 'reviews/:slug', loadComponent: () => import('./reviews/review-detail.component').then(m => m.ReviewDetailComponent) },
      { path: 'news', loadComponent: () => import('./news/news.component').then(m => m.NewsComponent) },
      { path: 'news/:slug', loadComponent: () => import('./news/news-detail.component').then(m => m.NewsDetailComponent) },
      { path: 'maps', loadComponent: () => import('./maps/maps.component').then(m => m.MapsComponent) },
      { path: 'maps/:slug', loadComponent: () => import('./maps/location-detail.component').then(m => m.LocationDetailComponent) }
    ]
  }
];
