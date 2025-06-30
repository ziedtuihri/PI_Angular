import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { EntrepriseListComponent } from './pages/ui-components/AdminUI/entreprise-list/entreprise-list.component';
import { EventListComponent} from './pages/ui-components/AdminUI/events-list/event-list.component';
import { EditEventDialogComponent} from './pages/ui-components/AdminUI/events-list/EditEventDialogComponent';
import { EncadrantComponent} from './pages/ui-components/AdminUI/Encadrant/encadrant.component';
import { OffreComponent} from './pages/ui-components/AdminUI/Offre PFE/offre.component';
import { EntrepriseViewComponent} from './pages/ui-components/EntrepriseUI/DashboardEntreprise/entreprise-view.component';
import { EntrepriseProfileComponent} from './pages/ui-components/EntrepriseUI/MyProfile/entreprise-profile.component';
import {AdminProfileComponent} from './pages/ui-components/AdminUI/AdminView/admin-view.component';
import {EntrepriseOffresComponent} from './pages/ui-components/EntrepriseUI/MyPFE/entreprise-offres.component';
import {EventEntrepriseComponent} from './pages/ui-components/EntrepriseUI/MyEvents/entreprise-event-dashboard.component';
import {EntrepriseEncadrantComponent} from './pages/ui-components/EntrepriseUI/MyEncadrant/encadrant.component';
import {StudentViewComponent} from './pages/ui-components/EtudiantUI/StudentView/student-view.component';
import { AuthGuard } from './services/auth.guard';
import {
  CandidatureManagementComponent
} from "./pages/ui-components/EntrepriseUI/Candidatures/candidature-management.component";
import {StudentOffreComponent} from "./pages/ui-components/EtudiantUI/Student - OffrePFE/student-offre.component";
import {StudentEventComponent} from "./pages/ui-components/EtudiantUI/Student-Events/student-event.component";
import {
  AdzunaDashboardComponent,
} from "./pages/ui-components/EtudiantUI/JobMarketDashboard/adzuna-job-market.component";
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
  { path: 'admin/entreprises', component: EntrepriseListComponent },
  { path: 'admin/evenements', component: EventListComponent },           // Event List
  { path: 'admin/evenements/edit/:id', component: EditEventDialogComponent },
  { path: 'admin/encadrant', component: EncadrantComponent },
  { path: 'admin/offres', component: OffreComponent },
  { path: 'entreprise/dashboard', component: EntrepriseViewComponent },
  {path: 'entreprise/profile', component: EntrepriseProfileComponent },
  {path: 'admin/profile', component: AdminProfileComponent},
  {path: 'entreprise/offres', component: EntrepriseOffresComponent},
  {path: 'entreprise/events', component: EventEntrepriseComponent},
  {path: 'entreprise/encadrants', component:  EntrepriseEncadrantComponent},
  {path: 'entreprise/candidatures', component:    CandidatureManagementComponent},
  {path: 'student/dashboard', component:  StudentViewComponent},
  {path: 'student/offres', component:  StudentOffreComponent},
  {path: 'student/events', component:  StudentEventComponent},
  {path: 'student/JobMarket', component:  AdzunaDashboardComponent}
];
