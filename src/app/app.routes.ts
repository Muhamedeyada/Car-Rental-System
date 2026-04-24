import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { customerGuard } from './core/guards/customer.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/auth/login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'admin/register',
    loadComponent: () =>
      import('./features/admin/auth/register/admin-register.component').then(m => m.AdminRegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'admin/users',
    loadComponent: () =>
      import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/cars',
    loadComponent: () =>
      import('./features/admin/cars/admin-cars.component').then(m => m.AdminCarsComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/orders',
    loadComponent: () =>
      import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'cars',
    loadComponent: () =>
      import('./features/customer/cars/car-list.component').then(m => m.CarListComponent),
    canActivate: [customerGuard],
  },
  {
    path: 'cars/:id',
    loadComponent: () =>
      import('./features/customer/cars/car-details.component').then(m => m.CarDetailsComponent),
    canActivate: [customerGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/customer/orders/order-list.component').then(m => m.OrderListComponent),
    canActivate: [customerGuard],
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/customer/orders/order-details.component').then(m => m.OrderDetailsComponent),
    canActivate: [customerGuard],
  },
  {
    path: 'installments',
    loadComponent: () =>
      import('./features/customer/installments/installments.component').then(m => m.InstallmentsComponent),
    canActivate: [customerGuard],
  },
  { path: '**', redirectTo: '/login' },
];
