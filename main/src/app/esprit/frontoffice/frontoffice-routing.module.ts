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
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      { path: 'offers', component: OfferListComponent },
      { path: 'offers/:id', component: OfferDetailsComponent },
      { path: 'apply/:offerId', component: ApplyFormComponent },
      { path: 'quiz/:quizId', component: QuizAttemptComponent },
      { path: 'my-applications', component: StudentApplicationsComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule {}