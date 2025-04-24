import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, finalize, from, of, switchMap, tap, throwError, toArray } from 'rxjs';
import { Answer } from 'src/app/shared/models/answer';
import { Question } from 'src/app/shared/models/question';
import { Quiz } from 'src/app/shared/models/quiz';
import { QuizService } from 'src/app/shared/services/quiz.service';

@Component({
  selector: 'app-create-quiz',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})
export class CreateQuizComponent {
   offerId!: number;
    isLoading = false;
    isSubmitting = false;
    quizForm!: FormGroup;
    currentQuestionIndex = 0;
  
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private quizService: QuizService,
      private fb: FormBuilder
    ) {}
  
    ngOnInit(): void {
      // Get the offer ID from the route
      const idParam = this.route.snapshot.paramMap.get('offerId');
      if (idParam) {
        this.offerId = +idParam;
        this.initForm();
        // Always start with at least one question and one answer
        this.addQuestion();
      } else {
        console.error('No offer ID provided in the route');
      }
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
      if (questionIndex >= 0 && questionIndex < this.questions.length) {
        return this.questions.at(questionIndex).get('answers') as FormArray;
      }
      return this.fb.array([]);
    }
  
    addQuestion(): void {
      const questionGroup = this.fb.group({
        id: [null], // Use null for new entities
        content: ['', Validators.required],
        answers: this.fb.array([])
      });
      this.questions.push(questionGroup);
      
      // Add at least one answer to the new question
      this.addAnswerToQuestion(questionGroup);
      
      // Navigate to the newly added question
      this.currentQuestionIndex = this.questions.length - 1;
    }
  
    addAnswerToQuestion(questionControl: AbstractControl): void {
      const answers = questionControl.get('answers') as FormArray;
      const answerGroup = this.fb.group({
        id: [null], // Use null for new entities
        content: ['', Validators.required],
        correct: [false]
      });
      answers.push(answerGroup);
    }
  
    removeQuestion(index: number): void {
      if (index >= 0 && index < this.questions.length) {
        this.questions.removeAt(index);
        // Adjust current question index if necessary
        if (this.currentQuestionIndex >= this.questions.length) {
          this.currentQuestionIndex = Math.max(0, this.questions.length - 1);
        }
      }
    }
  
    removeAnswer(questionIndex: number, answerIndex: number): void {
      const answers = this.getAnswers(questionIndex);
      if (answerIndex >= 0 && answerIndex < answers.length) {
        answers.removeAt(answerIndex);
      }
    }
  
    navigateToQuestion(index: number): void {
      if (index >= 0 && index < this.questions.length) {
        this.currentQuestionIndex = index;
      }
    }
  
    saveQuiz(): void {
      if (this.quizForm.invalid) {
        this.markFormGroupTouched(this.quizForm);
        return;
      }
  
      this.isSubmitting = true;
      const formValue = this.quizForm.value;
  
      // Create the quiz without an ID
      const quiz: Quiz = {
        id: null, // Explicitly set to null for new creation
        title: formValue.title,
        offer: { 
          id: this.offerId,
          title: '',
          description: '',
          location: '',
          company: ''
        }
      };
  
      // Only create, no update logic
      this.quizService.createQuiz(quiz).pipe(
        tap(savedQuiz => {
          console.log('Quiz created successfully:', savedQuiz);
        }),
        // Now save the questions
        switchMap(savedQuiz => {
          if (!savedQuiz.id) {
            throw new Error('Quiz created without an ID');
          }
          
          return this.createQuestions(savedQuiz);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      ).subscribe({
        next: () => {
          alert('Quiz created successfully!');
          // Optional: Navigate back to the offer details or list
          this.router.navigate(['/dashboard/backoffice/offers/details', this.offerId]);
        },
        error: (err) => {
          console.error('Error creating quiz:', err);
          alert('Error creating quiz. Please try again.');
        }
      });
    }
  
    private createQuestions(quiz: Quiz) {
      if (!quiz.id) {
        return throwError(() => new Error('Quiz has no ID'));
      }
  
      const questions = this.quizForm.value.questions;
      if (!questions || questions.length === 0) {
        return of(null);
      }
  
      // Process each question sequentially to maintain order
      return from(questions).pipe(
        concatMap((q: any) => {
          const question: Question = {
            id: null, // Explicitly null for creation
            content: q.content,
            quiz: { 
              id: quiz.id!,
              title: quiz.title
            }
          };
  
          return this.quizService.addQuestion(question).pipe(
            switchMap(savedQuestion => {
              if (!q.answers || q.answers.length === 0) {
                return of(savedQuestion);
              }
              return this.createAnswers(savedQuestion, q.answers);
            })
          );
        }),
        toArray() // Collect all results
      );
    }
  
    private createAnswers(question: Question, answers: any[]) {
      if (!question.id) {
        return throwError(() => new Error('Question has no ID'));
      }
  
      if (!answers || answers.length === 0) {
        return of(null);
      }
  
      // Process each answer sequentially
      return from(answers).pipe(
        concatMap((a: any) => {
          const answer: Answer = {
            id: null, // Explicitly null for creation
            content: a.content,
            correct: a.correct,
            question: { 
              id: question.id!,
              content: question.content 
            }
          };
  
          return this.quizService.addAnswer(answer);
        }),
        toArray() // Collect all results
      );
    }
  
    private markFormGroupTouched(control: AbstractControl): void {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          this.markFormGroupTouched(control.get(key)!);
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          this.markFormGroupTouched(ctrl);
        });
      } else {
        control.markAsTouched();
      }
    }
}
