import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '',            renderMode: RenderMode.Client },
  { path: 'products',    renderMode: RenderMode.Client },
  { path: 'product-detail/:id', renderMode: RenderMode.Client },
  { path: 'login',       renderMode: RenderMode.Client },
  { path: 'admin',       renderMode: RenderMode.Client },
  { path: 'blog',        renderMode: RenderMode.Client },
  { path: 'blog/:id',    renderMode: RenderMode.Client },
  { path: '**',    renderMode: RenderMode.Client },
];
