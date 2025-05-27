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
    console.log('Component initialized');
    this.offerId = Number(this.route.snapshot.paramMap.get('offerId'));
    this.quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.initForm();
    this.loadQuiz();
  }

  initForm(quiz?: Quiz): void {
    this.quizForm = this.fb.group({
      title: [quiz?.title || '', Validators.required],
      questions: this.fb.array(
        (quiz?.questions || []).map(question => this.fb.group({
          id: [question.id],
          content: [question.content, Validators.required],
          answers: this.fb.array(
            (question.answers ?? []).map(answer => 
              this.fb.group({
              id: [answer.id],
              content: [answer.content, Validators.required],
              correct: [answer.correct]
            }))
          )
        }))
      )
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  loadQuiz(): void {
    console.log('Starting loadQuiz()');
    console.log('Fetching quiz', this.quizId);
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        console.log('Received quiz data:', JSON.parse(JSON.stringify(quiz)));
        
        // Debug current form state before updates
        console.log('Form before update:', {
          title: this.quizForm.get('title')?.value,
          questionsCount: this.questions.length,
          questions: this.questions.value
        });
  
        // Clear existing questions
        console.log('Clearing existing questions...');
        while (this.questions.length > 0) {
          this.questions.removeAt(0);
        }
        console.log('After clearing - questions count:', this.questions.length);
  
        // Set title
        this.quizForm.patchValue({ title: quiz.title });
        console.log('Title set to:', quiz.title);
  
        if (quiz.questions?.length) {
          console.log('Processing', quiz.questions.length, 'questions...');
          
          quiz.questions.forEach((question, i) => {
            console.log(`Processing question ${i}:`, question.content);
            
            const answersFormArray = this.fb.array(
              (question.answers ?? []).map((answer, j) => {
                console.log(`  Adding answer ${j}:`, answer.content, 'correct:', answer.correct);
                return this.fb.group({
                  id: [answer.id],
                  content: [answer.content, Validators.required],
                  correct: [answer.correct]
                });
              })
            );
  
            this.questions.push(this.fb.group({
              id: [question.id],
              content: [question.content, Validators.required],
              answers: answersFormArray
            }));
  
            console.log(`Added question ${i} - current questions count:`, this.questions.length);
          });
        }
  
        // Debug final form state
        console.log('Form after update:', {
          title: this.quizForm.get('title')?.value,
          questionsCount: this.questions.length,
          questions: this.questions.value
        });
  
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
      description: this.quizForm.value.description,
      questions: this.questions.controls.map((qControl: AbstractControl) => ({
        id: qControl.value.id ?? null,
        content: qControl.value.content,
        answers: qControl.get('answers')?.value.map((a: any) => ({
          id: a.id ?? null,
          content: a.content,
          correct: a.correct
        }))
      })),
      offer: {
        id: this.offerId,
        title: '',
        description: '',
        location: '',
        company: ''
      }
    };
  
    console.log('Sending update with:', updatedQuiz); // Debug what we're sending
  
    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: (savedQuiz) => {
        console.log('Received updated quiz:', savedQuiz); // Debug what we got back
        
        // Clear and rebuild the form with the response data
        this.quizForm.reset();
        while (this.questions.length) {
          this.questions.removeAt(0);
        }
        
        this.quizForm.patchValue({ title: savedQuiz.title });
        
        if (savedQuiz.questions) {
          savedQuiz.questions.forEach(question => {
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
  
        alert('Quiz updated successfully!');
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error updating quiz:', err);
        alert('Failed to update quiz');
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy(): void {
    console.log('Component destroyed');
  }
}
