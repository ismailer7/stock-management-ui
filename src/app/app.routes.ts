import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { AccountComponent } from './components/account/account.component';
import { SaleComponent } from './components/sale/sale.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';
import { LayaoutComponent } from './components/layaout/layaout.component';
import { LoginLayoutComponent } from './data/login-layout/login-layout.component';

export const routes: Routes = [
    {
    path: '',
    component: LoginLayoutComponent,
    children: [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]},
    {
    path: '',
    component: LayaoutComponent,
    children: [
    { path: 'dashboard', component: DashboardComponent, data: { name: 'Dashboard'} },
    { path: 'products', component: ProductComponent, data: { name: 'Products'} },
    { path: 'category', component: CategoryComponent, data: { name: 'Category'} },
    { path: 'sales', component: SaleComponent, data: { name: 'Sales'} },
    { path: 'account', component: AccountComponent, data: { name: 'Account'} } 
]}
];
