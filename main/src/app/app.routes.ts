import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

import { ProjetComponent } from './pages/admin/projet/projet.component';
import {ProjetDetailComponent} from './pages/admin/projet/projet-detail.component';
import {SprintEtudiantsComponent} from './pages/admin/sprint/sprint-etudiants.component'

import { AuthGuard } from './services/auth.guard';
import { ProjetFormComponent } from './pages/admin/projet/form.component';
import {SprintListComponent} from './pages/admin/sprint/sprint-list.component';
import { SprintFormAdminComponent } from './pages/admin/sprint/sprint-form.component';
import { SprintDetailsComponent} from './pages/admin/sprint/sprint-details.component'
import { ListtacheComponent } from './pages/admin/tache/listtache.component'; // Make sure this is imported
import { TacheFormComponent } from './pages/admin/tache/tache-form-admin.component';
import { TacheDetailsComponent } from './pages/admin/tache/tachedetail.component';

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
        component: SprintFormAdminComponent,
      },

      {
        path: 'sprints/:id/edit',
        component: SprintFormAdminComponent,
      },
      {
        path: 'sprints/:id/etudiants/manage',
        component: SprintEtudiantsComponent,
      },
       
      // Route for adding a new task to a specific sprint
      { path: 'sprints/:sprintId/tasks/add', component: TacheFormComponent}, // Or TaskAddComponent, etc.

      // If you also have an edit task route
      { path: 'sprints/:sprintId/tasks/edit/:taskId', component: TacheFormComponent },

      // <<< ADD THIS ROUTE TO DISPLAY TASKS FOR A SPECIFIC SPRINT >>>
      { path: 'sprints/:sprintId/tasks', component: ListtacheComponent }, // <<< THIS IS THE MISSING ROUTE

        { path: 'general-calendar', component: CalendarListComponent }, // **Changed to CalendarListComponent**

      {
        path: 'taches',
        component: ListtacheComponent,
      },
      {
        path: 'taches/add',
        component: TacheFormComponent,
      },
       // Route for displaying task details
  // The parameters in the URL pattern MUST match what you extract in the component
  { path: 'sprints/:sprintId/tasks/details/:id', component: TacheDetailsComponent },

      {
         path: 'taches/edit/:id',
        component: TacheFormAdminComponent,
      },
      {
        path: 'taches/details/:id',
        component: TacheDetailsComponent,
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