import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobApplication } from 'src/app/shared/models/job-application';
import { Offer } from 'src/app/shared/models/offer';
import { Question } from 'src/app/shared/models/question';
import { Quiz } from 'src/app/shared/models/quiz';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { OfferService } from 'src/app/shared/services/offer.service';
import { QuizService } from 'src/app/shared/services/quiz.service';

@Component({
  selector: 'app-apply-form',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.scss'
})
export class ApplyFormComponent {
  offerId!: number;
  quizId!: number;

  offer!: Offer;
  quiz!: Quiz;
  questions: Question[] = [];

  form: FormGroup = new FormGroup({
    linkedinUrl: new FormControl('', Validators.required),
    portfolioUrl: new FormControl(''),
    certificateUrls: new FormControl([]),
  });

  currentStep = 1;
  applicationId: number | null = null;

  selectedAnswers: { [questionId: number]: number | null } = {};
  selectedFiles: { [key: string]: File | null } = { cv: null, coverLetter: null };

  showScorePopup = false;
  lastScore: number = 0;
  scoreClass: string = '';

  selectedFileNames: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private quizService: QuizService,
    private jobAppService: JobApplicationService
  ) {}

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('offerId')!;
    this.quizId = +this.route.snapshot.paramMap.get('quizId')!;

    this.offerService.getOfferById(this.offerId).subscribe(offer => this.offer = offer);

    this.quizService.getQuizById(this.quizId).subscribe(quiz => {
      this.quiz = quiz;
      if (quiz.id) {
        this.quizService.getQuestionsByQuiz(quiz.id).subscribe(questions => {
          this.questions = questions;
          for (let question of questions) {
            this.quizService.getAnswersByQuestion(question.id!).subscribe(answers => {
              question.answers = answers;
            });
          }
        });
      }
    });
  }

  nextStep(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const applicationPayload = {
      ...this.form.value,
      offer: this.offer,
      appliedAt: new Date()
    };

    this.jobAppService.apply(applicationPayload).subscribe(application => {
      this.applicationId = application.id ?? null;

      if (!this.applicationId) {
        alert('Application failed to create.');
        return;
      }

      if (this.selectedFiles['cv'] || this.selectedFiles['coverLetter']) {
        const formData = new FormData();
        if (this.selectedFiles['cv']) formData.append('cv', this.selectedFiles['cv']);
        if (this.selectedFiles['coverLetter']) formData.append('coverLetter', this.selectedFiles['coverLetter']);

        this.jobAppService.uploadFiles(this.applicationId, formData).subscribe({
          next: () => this.currentStep = 2,
          error: () => {
            alert('Upload failed. Application created.');
            this.currentStep = 2;
          }
        });
      } else {
        this.currentStep = 2;
      }
    });
  }

  submitApplication(): void {
    if (!this.applicationId) return;

    const rawScore = this.calculateScore();
    const percentage = this.questions.length > 0
      ? Math.round((rawScore / this.questions.length) * 100)
      : 0;

    this.jobAppService.updateScore(this.applicationId, percentage).subscribe(() => {
      this.lastScore = percentage;
      this.scoreClass = this.getScoreClass(percentage);
      this.showScorePopup = true;
    });
  }

  onAnswerSelect(questionId: number, answerId: number): void {
    this.selectedAnswers[questionId] = answerId;
  }

  calculateScore(): number {
    let score = 0;
    this.questions.forEach(q => {
      const correctAnswer = q.answers?.find(a => a.correct);
      const selectedId = this.selectedAnswers[q.id!];
      if (selectedId && selectedId === correctAnswer?.id) {
        score += 1;
      }
    });
    return score;
  }

  onFileSelect(event: Event, type: 'cv' | 'coverLetter'): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.selectedFiles[type] = input.files[0];
    this.selectedFileNames[type] = input.files[0].name;
  }
}

  updateCertificateUrls(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const urls = value.split(',').map(s => s.trim()).filter(Boolean);
    this.form.get('certificateUrls')?.setValue(urls);
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  }

  goToMyApplications(): void {
    this.showScorePopup = false;
    this.router.navigate(['/dashboard/frontoffice/my-applications']);
  }
}
