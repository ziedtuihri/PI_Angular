import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';





import { AuthGuard } from './services/auth.guard';
import { EntryComponent } from './esprit/entry/entry.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },

    ],
  },
  {path: "entry", component: EntryComponent},
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
