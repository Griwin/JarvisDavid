import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Translate } from './pages/translate/translate';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'translate',
    component: Translate
  }
];
