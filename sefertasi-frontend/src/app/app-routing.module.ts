// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
{ path: '', component: ProductListComponent },
{ path: 'products', component: ProductListComponent },
{ path: 'login', component: LoginComponent },
{
path: 'admin',
component: AdminDashboardComponent,
canActivate: [AuthGuard]
},
{ path: '**', redirectTo: '' }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule {}