import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackLayoutComponent } from './back-layout/back-layout.component';
import { UpdateQuizComponent } from './components/quiz/update-quiz/update-quiz.component';
import { OfferListComponent } from './components/offer/offer-list/offer-list.component';
import { OfferFormComponent } from './components/offer/offer-form/offer-form.component';
import { OfferDetailsComponent } from './components/offer/offer-details/offer-details.component';
import { CreateQuizComponent } from './components/quiz/create-quiz/create-quiz.component';
import { ApplicationListComponent } from './components/applications/application-list/application-list.component';
import { ApplicationDetailsComponent } from './components/applications/application-details/application-details.component';

const routes: Routes = [
  {
    path: '', // /dashboard/backoffice
    component: BackLayoutComponent,
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      // Offer routes
      { path: 'offers', component: OfferListComponent },
      { path: 'offers/create', component: OfferFormComponent },
      { path: 'offers/details/:id', component: OfferDetailsComponent },
      { path: 'offers/edit/:id', component: OfferFormComponent },
      // Quiz Routes
      { path: 'quiz/create/offer/:offerId', component: CreateQuizComponent },
      { path: 'quiz/update/:quizId/offer/:offerId', component: UpdateQuizComponent },
      // Application Routes
      { path: 'applications', component: ApplicationListComponent },
      { path: 'applications/:id', component: ApplicationDetailsComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
