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
      component: LoginComponent,
      data: { name: 'Login'} 
    },
    { 
      path: 'home',
      component:LayoutComponent,
      canMatch:[authGuard],
      data: { name: 'Home'},
      children: [
        { 
            path: 'dashboard',
            component: DashboardComponent,
            data: { name: 'Dashboard'} 
        },
        {
            path: 'products',
            component: ProductComponent,
            data: { name: 'Products'} 
        },
        {  
            path: 'category',
            component: CategoryComponent,
            data: { name: 'Category'} 
        },
        {   
            path: 'sales',
            component: SaleComponent,
            data: { name: 'Sales'} 
        },
        {       
            path: 'account',
            component: AccountComponent,
            data: { name: 'Account'} 
        }]
    }];