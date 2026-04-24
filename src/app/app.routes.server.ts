import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'register', renderMode: RenderMode.Client },
  { path: 'admin/login', renderMode: RenderMode.Client },
  { path: 'admin/register', renderMode: RenderMode.Client },
  { path: 'admin/users', renderMode: RenderMode.Client },
  { path: 'admin/cars', renderMode: RenderMode.Client },
  { path: 'admin/orders', renderMode: RenderMode.Client },
  { path: 'cars', renderMode: RenderMode.Server },
  { path: 'cars/:id', renderMode: RenderMode.Server },
  { path: 'orders', renderMode: RenderMode.Client },
  { path: 'orders/:id', renderMode: RenderMode.Client },
  { path: 'installments', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
