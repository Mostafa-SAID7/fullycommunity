import { Routes } from '@angular/router';

export const qaRoutes: Routes = [
  { path: '', redirectTo: 'questions', pathMatch: 'full' },
  { path: 'questions', loadComponent: () => import('./qa-questions.component').then(m => m.QaQuestionsComponent) },
  { path: 'analytics', loadComponent: () => import('./qa-analytics.component').then(m => m.QaAnalyticsComponent) },
  { path: 'tags', loadComponent: () => import('./qa-tags.component').then(m => m.QaTagsComponent) }
];
