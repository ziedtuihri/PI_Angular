import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/app/shared/models/quiz';
import { QuizService } from 'src/app/shared/services/quiz.service';

@Component({
  selector: 'app-update-quiz',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.scss'
})
export class UpdateQuizComponent {
  quizForm!: FormGroup;
  quizId!: number;
  offerId!: number;
  isSubmitting = false;
  isLoading = true;
  currentQuestionIndex = 0;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.initForm();
    this.loadQuiz();
  }

  initForm(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  loadQuiz(): void {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quizForm.patchValue({ title: quiz.title });
  
        if (quiz.questions?.length) {
          quiz.questions.forEach(question => {
            const answersFormArray = this.fb.array(
              (question.answers ?? []).map(answer => this.fb.group({
                content: [answer.content, Validators.required],
                correct: [answer.correct]
              }))
            );
            this.questions.push(this.fb.group({
              content: [question.content, Validators.required],
              answers: answersFormArray
            }));
          });
        }
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load quiz:', err);
        this.isLoading = false;
      }
    });
  }
  

  addQuestion(): void {
    const questionGroup = this.fb.group({
      content: ['', Validators.required],
      answers: this.fb.array([
        this.fb.group({ content: ['', Validators.required], correct: [false] })
      ])
    });
    this.questions.push(questionGroup);
    this.currentQuestionIndex = this.questions.length - 1;
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    this.currentQuestionIndex = Math.max(0, this.currentQuestionIndex - 1);
  }

  addAnswerToQuestion(question: AbstractControl): void {
    const answers = question.get('answers') as FormArray;
    answers.push(this.fb.group({
      content: ['', Validators.required],
      correct: [false]
    }));
  }

  removeAnswer(questionIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.removeAt(answerIndex);
  }

  navigateToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  updateQuiz(): void {
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const updatedQuiz: Quiz = {
      id: this.quizId,
      title: this.quizForm.value.title,
      questions: this.quizForm.value.questions.map((q: any) => ({
        content: q.content,
        answers: q.answers
      })),
      offer: {
        id: this.offerId,
        title: '',
        description: '',
        location: '',
        company: ''
      }
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: () => {
        alert('Quiz updated successfully!');
        this.router.navigate(['/offers', this.offerId]);
      },
      error: (err) => {
        console.error('Error updating quiz:', err);
        alert('Failed to update quiz');
        this.isSubmitting = false;
      }
    });
  }
}
