import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'frontoffice',
    loadChildren: () =>
      import('../esprit/frontoffice/frontoffice.module').then((m) => m.FrontofficeModule),
  },
  {
    path: 'backoffice',
    loadChildren: () =>
      import('../esprit/backoffice/backoffice.module').then((m) => m.BackofficeModule),
  },
];
