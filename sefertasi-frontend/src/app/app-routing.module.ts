import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Admin } from './components/admin/admin';
import { Login } from './components/login/login';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin', component: Admin },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }