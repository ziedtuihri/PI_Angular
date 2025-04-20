import { Quiz } from './quiz';
import { JobApplication } from './job-application';

export interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  company: string;
  type?: string; // e.g., "Stage", "CDI", "CDD", etc.
  startDate?: Date;
  endDate?: Date;
  companyId?: number;
  quiz?: Quiz; // Reference to Quiz
  applications?: JobApplication[]; // Collection of JobApplications
}