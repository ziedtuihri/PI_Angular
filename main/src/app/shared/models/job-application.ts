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

  appliedAt?: Date; // Use string to hold ISO date (from LocalDate)
  quizScore: number;

  status: string; // "NEW", "APPROVED", "INTERVIEW", "REJECTED"

  meetingLink?: string;
}
