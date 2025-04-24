import { Offer } from './offer';

export interface JobApplication {
  id?: number;
  studentId: number;
  offer?: Offer; // Reference to Offer
  cvPath?: string;
  coverLetterPath?: string;
  certificatesPath?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  certificateUrls: string[]; // Array of certificate URLs
  appliedAt?: Date; // Application date
  quizScore: number;
  status: string;
}