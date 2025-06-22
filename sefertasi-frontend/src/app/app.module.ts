import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CategoryFilterComponent } from './components/category-filter/category-filter';
import { ProductCardComponent } from './components/product-card/product-card';
import { ProductListComponent } from './components/product-list/product-list';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  // 1️⃣ Sadece bileşen/pipe/directive ekleyin
  declarations: [
  ],

  // 2️⃣ Sadece modüller ekleyin
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],

  providers: [],
  bootstrap: []
})
export class AppModule { }
