import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { AccountComponent } from './account/account.component';
import { SaleComponent } from './sale/sale.component';
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, data: { name: 'Dashboard'} },
    { path: 'products', component: ProductComponent, data: { name: 'Products'} },
    { path: 'category', component: CategoryComponent, data: { name: 'Category'} },
    { path: 'sales', component: SaleComponent, data: { name: 'Sales'} },
    { path: 'account', component: AccountComponent, data: { name: 'Account'} }
];
