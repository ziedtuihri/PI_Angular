import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProjetComponent } from './pages/admin/projet/projet.component';
import {ProjetDetailComponent} from './pages/admin/projet/projet-detail.component';
import {SprintEtudiantsComponent} from './pages/admin/sprint/sprint-etudiants.component'
import { AuthGuard } from './services/auth.guard';
import { ProjetFormComponent } from './pages/admin/projet/form.component';
import {SprintListComponent} from './pages/admin/sprint/sprint-list.component';
import { SprintFormComponent } from './pages/admin/sprint/sprint-form.component';
import { SprintDetailsComponent} from './pages/admin/sprint/sprint-details.component'
import { ListtacheComponent } from './pages/admin/tache/listtache.component';

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
        path: 'projet', 
        component :ProjetComponent,
      },
      {
        path: 'projet/form', 
        component: ProjetFormComponent,
      },
      {
        path: 'projet/form/:id', 
        component: ProjetFormComponent,
      },
      {
        path: 'projet/detail/:id', 
        component: ProjetDetailComponent, 
      },
      {
        path: 'sprints/details/:id', 
        component: SprintDetailsComponent, 
      },

      {
        path: 'sprints', 
        component: SprintListComponent,
      },
      {
        path: 'sprints/add',
        component: SprintFormComponent,
      },

      {
        path: 'sprints/:id/edit',
        component: SprintFormComponent,
      },
      {
        path: 'sprints/:id/etudiants/manage', // Ajout de la route pour la gestion des étudiants du sprint
        component: SprintEtudiantsComponent,
      },
      {
        path: 'taches', 
        component: ListtacheComponent,
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
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
