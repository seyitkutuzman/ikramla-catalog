// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app';
import { HeaderComponent } from './components/header/header';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductCardComponent } from './components/product-card/product-card';
import { CategoryFilterComponent } from './components/category-filter/category-filter';
import { HeroSectionComponent } from './components/hero-section/hero-section';
import { FooterComponent } from './components/footer/footer';
@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
        AppComponent,
    HeaderComponent,
    ProductListComponent,
    ProductCardComponent,
    CategoryFilterComponent,
    HeroSectionComponent,
    FooterComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }