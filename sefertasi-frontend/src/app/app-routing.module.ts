// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { BlogListComponent } from './components/BlogList/BlogList';

const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'products', component: ProductListComponent },

    { path: 'product-detail/:id', component: ProductDetailComponent },
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

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule],

})
export class AppRoutingModule { }
