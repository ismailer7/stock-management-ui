import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { AccountComponent } from './components/account/account.component';
import { SaleComponent } from './components/sale/sale.component';
import { CategoryComponent } from './components/category/category.component';
import { LayoutComponent } from './components/layaout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth.guard';



export const routes: Routes = [
    { 
      path: '',
      redirectTo: '/login',
      pathMatch: 'full' },
    { 
      path: 'login',
      loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
      data: { name: 'Login'} 
    },
    { 
      path: 'home',
      // component:LayoutComponent,
        loadComponent: () => import('./components/layaout/layout.component').then(c => c.LayoutComponent),
        loadChildren: () => import('./layout.routes').then( c => c.routes),
      canMatch:[authGuard]
    }];