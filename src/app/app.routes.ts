import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { UnloggedGuard } from './core/guards/unlogged.guard';
import { LoggedGuard } from './core/guards/logged.guard';
import { ProductsComponent } from './features/products/products.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [ UnloggedGuard ] },
  { path: 'products', component: ProductsComponent, canActivate: [ LoggedGuard ] },
  { path: '**', redirectTo: '/products', pathMatch: 'full' },
];