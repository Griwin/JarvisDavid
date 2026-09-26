import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Translate } from './pages/translate/translate';
import { Summarize } from './pages/summarize/summarize';

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
  },
  {
    path: 'summarize',
    component: Summarize
  }
];
