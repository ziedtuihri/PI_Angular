import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

import { ProjetComponent } from './pages/admin/projet/projet.component';
import {ProjetDetailComponent} from './pages/admin/projet/projet-detail.component';
import {SprintEtudiantsComponent} from './pages/admin/sprint/sprint-etudiants.component'

import { AuthGuard } from './services/auth.guard';
import { ProjetFormComponent } from './pages/admin/projet/form.component';
import {SprintListComponent} from './pages/admin/sprint/sprint-list.component';

import { SprintDetailsComponent} from './pages/admin/sprint/sprint-details.component'
import { ListtacheComponent } from './pages/admin/tache/listtache.component';

import { TacheDetailsComponent } from './pages/admin/tache/tachedetail.component';

import { SprintFormAdminComponent } from './pages/admin/sprint/sprint-form.component';
import { TacheFormComponent } from './pages/admin/tache/tache-form-admin.component';

import { CalendarListComponent } from './pages/admin/sprint/calendar-list.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { NoteComponent } from './pages/note/note.component';
import { MoyenneComponent } from './pages/moyenne/moyenne.component';
import { AfficherNotesComponent } from './pages/afficher-notes/afficher-notes.component';
import { AddEvaluationComponent } from './pages/add-evaluation/add-evaluation.component';


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
        component: ProjetComponent,
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
 
      // --- Sprint Routes ---
      {
        path: 'sprints',
        component: SprintListComponent,
      },
      {
        // This path will now handle both adding and editing based on the component's internal logic
        // The error 'sprint/form' was trying to match this kind of pattern
        path: 'sprint/form', // Consistent with your navigate(['/sprint/form']) call
        component: SprintFormAdminComponent,
      },
      {
        path: 'sprint/form/:id', // For editing
        component: SprintFormAdminComponent,
      },
      {
        path: 'sprints/details/:id',
        component: SprintDetailsComponent,
      },
      {
        path: 'sprints/:id/etudiants/manage',
        component: SprintEtudiantsComponent,
      },
 
      // --- Task Routes (nested under sprints and general) ---
      // Route for displaying tasks for a specific sprint
      { path: 'sprints/:sprintId/tasks', component: ListtacheComponent },
      // Route for adding a new task to a specific sprint
      { path: 'sprints/:sprintId/tasks/add', component: TacheFormComponent },
      // If you also have an edit task route for a specific sprint
      { path: 'sprints/:sprintId/tasks/edit/:taskId', component: TacheFormComponent },
      // Route for displaying task details for a specific sprint
      { path: 'sprints/:sprintId/tasks/details/:id', component: TacheDetailsComponent },
 
 
      // General task routes (not tied to a specific sprint in the URL)
      {
        path: 'taches',
        component: ListtacheComponent,
      },
      {
        path: 'taches/add',
        component: TacheFormComponent,
      },
      {
        path: 'taches/edit/:id',
        component: TacheFormComponent,
      },
      {
        path: 'taches/details/:id',
        component: TacheDetailsComponent,
      },
      { path: 'calendar', component: CalendarListComponent },

      {
        path: 'evaluation',
        component: EvaluationComponent,
      },

      {
        path: 'note',
        component: NoteComponent,
      },
      {
      path: 'moyenne',
        component: MoyenneComponent,
      },

      {
        path: 'afficher-notes',
        component: AfficherNotesComponent,
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
