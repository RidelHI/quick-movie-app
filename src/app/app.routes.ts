import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/feature/home.page').then((m) => m.HomePageComponent)
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/feature/auth.page').then((m) => m.AuthPageComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/feature/auth-callback.page').then((m) => m.AuthCallbackPageComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
