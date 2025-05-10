import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quiz } from '../models/quiz';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
   private quizApiUrl = 'http://localhost:8081/api/quizzes';
    private questionApiUrl = 'http://localhost:8081/api/questions';
    private answerApiUrl = 'http://localhost:8081/api/answers';
  
      private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage or your preferred storage
        return new HttpHeaders({
          'Content-Type': 'application/json'
        });
      }

    constructor(private http: HttpClient) {}
  
    // Quiz methods
    createQuiz(quiz: Object): Observable<Quiz> {
      return this.http.post<Quiz>(this.quizApiUrl, quiz, { headers: this.getHeaders() });
    }
  
    getQuizById(id: number): Observable<Quiz> {
      return this.http.get<Quiz>(`${this.quizApiUrl}/${id}`);
    }

    updateQuiz(id: number,quiz: Quiz): Observable<Quiz> {
      return this.http.put<Quiz>(`${this.quizApiUrl}/${id}`, quiz, { headers: this.getHeaders() });
    }
    
    getQuizByOfferId(offerId: number): Observable<Quiz> {
      return this.http.get<Quiz>(`${this.quizApiUrl}/by-offer/${offerId}`);
    }
  
    // Question methods
    addQuestion(question: Object): Observable<Question> {
      return this.http.post<Question>(this.questionApiUrl, question);
    }
  
    getQuestionsByQuiz(quizId: number): Observable<Question[]> {
      return this.http.get<Question[]>(`${this.questionApiUrl}/by-quiz/${quizId}`);
    }
  
    updateQuestion(question: Question): Observable<Question> {
      return this.http.put<Question>(`${this.questionApiUrl}/${question.id}`, question);
    }
  
    deleteQuestion(questionId: number): Observable<void> {
      return this.http.delete<void>(`${this.questionApiUrl}/${questionId}`);
    }
  
    // Answer methods
    addAnswer(answer: Object): Observable<Answer> {
      return this.http.post<Answer>(this.answerApiUrl, answer);
    }
  
    getAnswersByQuestion(questionId: number): Observable<Answer[]> {
      return this.http.get<Answer[]>(`${this.answerApiUrl}/by-question/${questionId}`);
    }
    
    updateAnswer(answer: Answer): Observable<Answer> {
      return this.http.put<Answer>(`${this.answerApiUrl}/${answer.id}`, answer);
    }
  
    deleteAnswer(answerId: number): Observable<void> {
      return this.http.delete<void>(`${this.answerApiUrl}/${answerId}`);
    }
}
