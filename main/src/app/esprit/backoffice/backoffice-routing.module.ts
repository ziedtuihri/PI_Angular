import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BackLayoutComponent } from './back-layout/back-layout.component';
import { OfferManagementComponent } from './components/offer/offer-management/offer-management.component';
import { QuizManagementComponent } from './components/quiz-management/quiz-management.component';
import { QuestionManagementComponent } from './components/question-management/question-management.component';
import { AnswerManagementComponent } from './components/answer-management/answer-management.component';
import { ApplicationReviewComponent } from './components/application-review/application-review.component';
import { AllofferComponent } from './components/offer/alloffer/alloffer.component';

const routes: Routes = [
  {
    path: '',
    component: BackLayoutComponent,
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      { path: 'offers', component: AllofferComponent },
      { path: 'quizzes', component: QuizManagementComponent },
      { path: 'applications', component: ApplicationReviewComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
