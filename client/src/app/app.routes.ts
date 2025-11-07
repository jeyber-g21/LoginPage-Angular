import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
import { AuthGuard } from './auth/auth-guard';
import { Dashboard } from './auth/dashboard/dashboard';
import { Meeting } from './auth/meeting/meeting';
import { WeatherComponent } from './auth/weather/weather';
import { TasksComponent } from './auth/create-tasks/create-tasks';
import { Home } from './auth/home/home';
export const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'weather', component: WeatherComponent },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'meeting', component: Meeting, canActivate: [AuthGuard] },
  { path: 'create-task', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:id', component: Dashboard, canActivate: [AuthGuard] },
];
