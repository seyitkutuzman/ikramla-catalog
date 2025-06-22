// src/main.ts
import 'zone.js';
import { bootstrapApplication }      from '@angular/platform-browser';
import { importProvidersFrom }       from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS }         from '@angular/common/http';
import { provideRouter }             from '@angular/router';

import { AppComponent }          from './app/app';
import { appRoutes }             from './app/app.routes';
import { AuthInterceptor }       from './app/interceptors/auth.interceptor';

import { BrowserModule }         from '@angular/platform-browser';
import { FormsModule }           from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    // Router’ı sağlayalım
    provideRouter(appRoutes),

    // HTTP client + interceptor’ları DI’dan al
    provideHttpClient(withInterceptorsFromDi()),

    // Class tabanlı interceptor’ı çoklu sağlayıcı olarak kaydet
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // NgModule’lerdeki modülleri standalone app’e import edin
    importProvidersFrom(
      BrowserModule,
      FormsModule
    )
  ]
}).catch(err => console.error(err));
