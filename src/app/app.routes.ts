import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./modules/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'inventario',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/inventario/inventario.component')
        .then(m => m.InventarioComponent)
  },
  {
    path: 'telemercadeo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/telemercadeo/telemercadeo.component')
        .then(m => m.TelemercadeoComponent)
  },
  {
    path: 'beneficios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/beneficios/beneficios.component')
        .then(m => m.BeneficiosComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/usuarios/usuarios.component')
        .then(m => m.UsuariosComponent)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];