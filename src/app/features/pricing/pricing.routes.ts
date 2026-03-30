import { Routes } from '@angular/router';

export const pricingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pricing-list/pricing-list.component').then(c => c.PricingListComponent)
  }
];
