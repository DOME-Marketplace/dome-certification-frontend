import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetComponent } from './auth/reset/reset.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewRequestComponent } from './pages/newRequest/newRequest.component';
import { UserRole } from '@models/user.role.model';
import { roleGuard } from '@guards/role.guard';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { DashboardCustomerComponent } from './pages/dashboardCustomer/dashboardCustomer.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.EMPLOYEE] },
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'home',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER],
        },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'Dashboard',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE],
        },
      },
      {
        path: 'dashboard-customer',
        component: DashboardCustomerComponent,
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'Dashboard',
          roles: [UserRole.ADMIN, UserRole.CUSTOMER],
        },
      },
      {
        path: 'newRequest',
        component: NewRequestComponent,
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'New request',
          roles: [UserRole.ADMIN, UserRole.CUSTOMER],
        },
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
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  // Si quieres manejar rutas no definidas, agrega una ruta comodín
  // { path: '**', component: PageNotFoundComponent }
];
