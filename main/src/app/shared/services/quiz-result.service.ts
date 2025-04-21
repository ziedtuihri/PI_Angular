import { Injectable } from '@angular/core';
import { JobApplication } from '../models/job-application';

@Injectable({
  providedIn: 'root'
})
export class QuizResultService {
  private score: number | null = null;
  private applicationDraft: JobApplication | null = null;

  constructor() { }


  setScore(score: number): void {
    this.score = score;
  }

  getScore(): number | null {
    return this.score;
  }

  clearScore(): void {
    this.score = null;
  }

  setApplicationDraft(app: JobApplication): void {
    this.applicationDraft = app;
  }

  getApplicationDraft(): JobApplication | null {
    return this.applicationDraft;
  }

  clearApplicationDraft(): void {
    this.applicationDraft = null;
  }
}
