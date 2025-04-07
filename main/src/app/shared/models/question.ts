import { Answer } from './answer';
import { Quiz } from './quiz';

export interface Question {
  id: number;
  content: string;
  quiz?: Quiz; // Reference to parent Quiz
  answers?: Answer[]; // Collection of child Answers
}