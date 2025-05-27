import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule,FormsModule],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.scss'
})
export class ApplyFormComponent {
  offerId!: number;
  quizId!: number;

  offer?: Offer;
  quiz?: Quiz;
  questions: Question[] = [];

  jobApplication: JobApplication = {
    studentId: 5, // set from logged-in user or elsewhere
    linkedinUrl: '',
    portfolioUrl: '',
    certificateUrls: [],
    appliedAt: new Date(),
    quizScore: 0,
    status: ''
  };

  selectedAnswers: { [questionId: number]: number | null } = {};

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private quizService: QuizService,
    private jobAppService: JobApplicationService,
    private router: Router
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

  onAnswerSelect(questionId: number, answerId: number): void {
    this.selectedAnswers[questionId] = answerId;
  }

  // update seq 
  currentStep = 1;
  selectedFiles: { [key: string]: File | null } = { cv: null, coverLetter: null };

  nextStep(): void {
    this.jobApplication.appliedAt = new Date();
    this.jobApplication.offer = this.offer;

    // First apply to create the application
    this.jobAppService.apply(this.jobApplication).subscribe(application => {
      // Save the ID from the response
      this.jobApplication.id = application.id;
      
      // Only proceed with file upload if we have an ID and files
      if (application.id && (this.selectedFiles['cv'] || this.selectedFiles['coverLetter'])) {
        const formData = new FormData();
        
        if (this.selectedFiles['cv']) {
          formData.append('cv', this.selectedFiles['cv']);
        }
        
        if (this.selectedFiles['coverLetter']) {
          formData.append('coverLetter', this.selectedFiles['coverLetter']);
        }

        // Upload the files
        this.jobAppService.uploadFiles(application.id, formData).subscribe(
          response => {
            console.log('Files uploaded successfully:', response);
            // Important: Fetch the updated application with file paths
            this.refreshApplication();
            this.currentStep = 2;
          },
          error => {
            console.error('File upload failed:', error);
            alert('Failed to upload files, but application was created. You can try uploading files later.');
            this.currentStep = 2;
          }
        );
      } else {
        // No files to upload, just proceed to next step
        this.currentStep = 2;
      }
    });
  }

   // Add this method to refresh the application data
   refreshApplication(): void {
    if (this.jobApplication.id) {
      this.jobAppService.getApplicationById(this.jobApplication.id).subscribe(
        updatedApp => {
          // Update the local jobApplication with all properties from the server
          this.jobApplication = {...updatedApp};
          console.log('Updated application with paths:', this.jobApplication);
        }
      );
    }
  }

  onFileSelect(event: Event, type: 'cv' | 'coverLetter'): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles[type] = input.files[0];
    }
  }



  submitApplication(): void {
    if (!this.jobApplication.id) return;

    const score = this.calculateScore();
    
    // Only update the score field, not the entire object
    // This prevents overwriting the file paths
    this.jobAppService.updateScore(this.jobApplication.id, score).subscribe(() => {
      alert(`Application submitted with score: ${score}`);
      this.router.navigate(['/dashboard/frontoffice/my-applications']);
    });
  }
}
