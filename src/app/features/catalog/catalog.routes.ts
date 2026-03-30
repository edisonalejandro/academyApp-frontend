import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./catalog.component').then(c => c.CatalogComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(c => c.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(c => c.CheckoutComponent)
  },
  {
    path: 'order/:orderNumber',
    loadComponent: () => import('./order-confirmation/order-confirmation.component').then(c => c.OrderConfirmationComponent)
  },
  {
    path: 'product/:slug',
    loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
  }
];
