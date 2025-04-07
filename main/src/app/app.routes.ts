import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

import { AuthGuard } from './services/auth.guard';
import { EntryComponent } from './esprit/entry/entry.component';

export const routes: Routes = [
  {
    path: '',
    component: EntryComponent, 
  },
  {
    path: 'frontoffice',
    loadChildren: () =>
      import('./esprit/frontoffice/frontoffice.module').then((m) => m.FrontofficeModule),
  },
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./esprit/backoffice/backoffice.module').then((m) => m.BackofficeModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
