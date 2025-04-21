import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/app/shared/models/quiz';
import { QuizResultService } from 'src/app/shared/services/quiz-result.service';
import { QuizService } from 'src/app/shared/services/quiz.service';

@Component({
  selector: 'app-quiz-attempt',
  imports: [CommonModule],
  templateUrl: './quiz-attempt.component.html',
  styleUrl: './quiz-attempt.component.scss'
})
export class QuizAttemptComponent {
  quiz!: Quiz;
  selectedAnswers: Map<number, number> = new Map();
  applicationId!: number;
  quizId: number;
  offerId: number;

  constructor(
    private quizService: QuizService,
    private quizResultService: QuizResultService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.applicationId = +this.route.snapshot.paramMap.get('id')!;
    this.quizId = +this.route.snapshot.paramMap.get('quizId')!;
    this.offerId = +this.route.snapshot.paramMap.get('quizId')!;
    this.loadQuiz();
  }

  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId).subscribe((quiz) => {
      this.quiz = quiz;
    });
  }

  selectAnswer(questionId: number, answerId: number): void {
    this.selectedAnswers.set(questionId, answerId);
  }

  submitQuiz(): void {
    const score = this.calculateScore();
    this.quizResultService.setScore(score);

    this.router.navigate([
      '/dashboard/frontoffice/apply',
      this.offerId,
      'quiz',
      this.quizId,
    ]);
  }

  private calculateScore(): number {
    let correctCount = 0;
    this.quiz.questions?.forEach(q => {
      const selectedAnswerId = this.selectedAnswers.get(q.id!);
      const correctAnswer = q.answers?.find(a => a.correct);
      if (selectedAnswerId && correctAnswer && correctAnswer.id === selectedAnswerId) {
        correctCount++;
      }
    });
    const total = this.quiz.questions?.length || 0;
    return total > 0 ? Math.round((correctCount / total) * 100) : 0;
  }
}
