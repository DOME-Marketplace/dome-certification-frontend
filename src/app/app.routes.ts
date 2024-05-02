import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetComponent } from './auth/reset/reset.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewRequestComponent } from './pages/newRequest/newRequest.component';
import { authGuardFn } from '@guards/auth-fn.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuardFn],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'newRequest',
        component: NewRequestComponent,
        data: { breadcrumb: 'New request' },
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'reset/:token',
        component: ResetComponent,
      },
    ],
  },
  // Agrega cualquier otra ruta principal aquí si es necesario
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  // Si quieres manejar rutas no definidas, agrega una ruta comodín
  // { path: '**', component: PageNotFoundComponent }
];
