import { Question } from './question';
import { Offer } from './offer';

export interface Quiz {
  id: number | null;
  title: string;
  description?: string;
  questions?: Question[]; // Collection of child Questions
  offer?: Offer; // Related offer (optional)
}