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
import { TacheFormAdminComponent } from './pages/admin/tache/tache-form-admin.component';
import { TacheDetailsComponent } from './pages/admin/tache/tachedetail.component';
import { AddEvaluationComponent } from './pages/add-evaluation/add-evaluation.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { NoteComponent } from './pages/note/note.component';


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
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
        path: 'sprints/:id/etudiants/manage', 
        component: SprintEtudiantsComponent,
      },
      {
        path: 'taches', 
        component: ListtacheComponent,
      },
      {
        path: 'taches/add', 
        component: TacheFormAdminComponent,
      },
      {
       path: 'taches/edit/:id',
        component: TacheFormAdminComponent,
      },
      {
        path: 'taches/details/:id', 
        component: TacheDetailsComponent,
      },

      {
        path: 'evaluation',
        component: EvaluationComponent,
      },

        {
        path: 'note',
        component: NoteComponent,
      },

  /* The code snippet you provided is defining the routing configuration for an Angular application. */

 

      {
        path: 'add-evaluation/:idProjet',
        component: AddEvaluationComponent,
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
      {
        path: 'reunions',
        loadChildren: () =>
          import('./pages/reunions/reunions.routes').then((m) => m.ReunionsRoutes),
      },

      {
        path: 'salles',
        loadChildren: () =>
          import('./pages/salles/salles.routes').then((m) => m.SallesRoutes),
      },

      {
        path: 'participants',
        loadChildren: () =>
          import('./pages/participants/participants.routes').then((m) => m.ParticipantsRoutes),
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
