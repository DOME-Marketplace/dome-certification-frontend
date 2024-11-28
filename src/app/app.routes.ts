import { Routes } from '@angular/router';
import { roleGuard } from '@guards/role.guard';
import { UserRole } from '@models/user.role.model';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { NewRequestComponent } from '@pages/newRequest/newRequest.component';
import { UnauthorizedComponent } from '@pages/unauthorized/unauthorized.component';
import { ForgotComponent } from './auth/forgot.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { ResetComponent } from './auth/reset.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    data: { roles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.EMPLOYEE] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          breadcrumb: 'Dashboard',
          roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CUSTOMER],
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
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },

    ],
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },

];
