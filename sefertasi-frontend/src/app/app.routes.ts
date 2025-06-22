// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { LoginComponent }          from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard }               from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '',         component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'login',    component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**',       redirectTo: '' }
];
