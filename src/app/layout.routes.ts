import { Routes } from '@angular/router';
import {LayoutComponent} from "./components/layaout/layout.component";


export const routes: Routes = [
    { path: 'dashboard',  loadComponent: () => import('./components/dashboard/dashboard.component').then( comp => comp.DashboardComponent)},
    { path: 'products',  loadComponent: () => import('./components/product/product.component').then( comp => comp.ProductComponent)},
    { path: 'sales', loadComponent: () => import('./components/sale/sale.component').then( comp => comp.SaleComponent)},
    { path: 'category', loadComponent: () => import('./components/category/category.component').then( comp => comp.CategoryComponent)},
    { path: 'account', loadComponent: () => import('./components/account/account.component').then( comp => comp.AccountComponent)}
];