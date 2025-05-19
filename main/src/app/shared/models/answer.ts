import { Question } from "./question";

export interface Answer {
    id: number | null;
    content: string;
    correct: boolean;
    question?: Question; // Reference to parent Question
  }