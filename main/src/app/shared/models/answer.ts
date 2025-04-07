import { Question } from "./question";

export interface Answer {
    id: number;
    content: string;
    correct: boolean;
    question?: Question; // Reference to parent Question
  }