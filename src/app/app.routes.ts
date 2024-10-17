import {Routes} from '@angular/router';
import {authGuard} from './auth.guard';


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
        loadComponent: () => import('./components/layaout/layout.component').then(c => c.LayoutComponent),
        loadChildren: () => import('./layout.routes').then( c => c.routes),
      canMatch:[authGuard]
    }];