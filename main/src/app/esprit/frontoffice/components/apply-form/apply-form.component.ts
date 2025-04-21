import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplication } from 'src/app/shared/models/job-application';
import { Offer } from 'src/app/shared/models/offer';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { QuizResultService } from 'src/app/shared/services/quiz-result.service';

@Component({
  selector: 'app-apply-form',
  imports: [CommonModule,FormsModule],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.scss'
})
export class ApplyFormComponent {
  application: JobApplication = { studentId: 1 };
  scoreCollected = false;
  quizId: number;
  offerId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizResultService: QuizResultService,
    private applicationService: JobApplicationService
  ) {}

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('offerId')!;
    this.quizId = +this.route.snapshot.paramMap.get('quizId')!;

    const draft = this.quizResultService.getApplicationDraft();
    if (draft) {
      this.application = draft;
    } else {
      this.application.offer = { id: this.offerId } as Offer;
    }

    const score = this.quizResultService.getScore();
    if (score !== null) {
      this.application.quizScore = score;
      this.scoreCollected = true;
    }
  }

  startQuiz(): void {
    this.quizResultService.setApplicationDraft(this.application);
    this.router.navigate([
      '/dashboard/frontoffice/quiz-attempt',
      this.quizId,
      'offer',
      this.offerId,
    ]);
  }

  onSubmit(): void {
    if (!this.scoreCollected) {
      alert('Please complete the quiz before submitting.');
      return;
    }

    this.application.appliedAt = new Date();

    this.applicationService.apply(this.application).subscribe((app) => {
      console.log('Application submitted:', app);
      this.quizResultService.clearScore();
      this.quizResultService.clearApplicationDraft();
      // Optional: redirect to a success page or applications list
    });
  }
}
