import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/ui/home.page').then((m) => m.HomePageComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./core/auth/ui/auth.page').then((m) => m.AuthPageComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./core/auth/ui/auth-callback.page').then((m) => m.AuthCallbackPageComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
