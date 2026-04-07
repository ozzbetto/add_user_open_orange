import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'remisiones',
    loadComponent: () => import('./features/remissions-list/remissions-list.component').then(m => m.RemissionsListComponent)
  },
  {
    path: 'remisiones/nuevo',
    loadComponent: () => import('./features/remissions-form/remissions-form.component').then(m => m.RemissionsFormComponent)
  },
  {
    path: 'remisiones/editar/:id',
    loadComponent: () => import('./features/remissions-form/remissions-form.component').then(m => m.RemissionsFormComponent)
  },
  {
    path: 'remisiones/ver/:id',
    loadComponent: () => import('./features/remissions-form/remissions-form.component').then(m => m.RemissionsFormComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];