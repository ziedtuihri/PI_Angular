import { Question } from './question';
import { Offer } from './offer';

export interface Quiz {
  id: number;
  title: string;
  questions?: Question[]; // Collection of child Questions
  offer?: Offer; // Related offer (optional)
}