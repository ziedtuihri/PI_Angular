import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FrontLayoutComponent } from './front-layout/front-layout.component';
import { OfferListComponent } from './components/offer-list/offer-list.component';
import { OfferDetailsComponent } from './components/offer-details/offer-details.component';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';
import { QuizAttemptComponent } from './components/quiz-attempt/quiz-attempt.component';
import { StudentApplicationsComponent } from './components/student-applications/student-applications.component';


const routes: Routes = [
  {
    path: '', // /dashboard/frontoffice
    component: FrontLayoutComponent,
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      // offer Routes
      { path: 'offers', component: OfferListComponent },
      { path: 'offers/:id', component: OfferDetailsComponent },
      // Quiz Routes
      { path: 'quiz-attempt/:quizId/offer/:offerId', component: QuizAttemptComponent },
      // Applications Routes
      { path: 'apply/:offerId/quiz/:quizId', component: ApplyFormComponent },
      { path: 'my-applications', component: StudentApplicationsComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule {}