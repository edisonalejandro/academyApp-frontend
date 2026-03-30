import { Routes } from '@angular/router';

export const classesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./classes-list/classes-list.component').then(c => c.ClassesListComponent)
  }
];
