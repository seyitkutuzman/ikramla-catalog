// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { LoginComponent }          from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard }               from './guards/auth.guard';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogListComponent } from './components/BlogList/BlogList';

export const appRoutes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent},
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard]
    },
    { path: 'blog', component: BlogListComponent },
    { path: 'blog/:id', component: BlogDetailComponent },
    { path: '**', redirectTo: '' },

];
