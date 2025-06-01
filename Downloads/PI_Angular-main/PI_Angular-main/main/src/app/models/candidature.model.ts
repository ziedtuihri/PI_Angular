import { Offre } from './offre.model';

export enum StatutCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'VALIDE',
  REFUSEE = 'REFUSE'
  // Add others as needed
}

export interface Candidature {
  id: number;
  dateCandidature: string; // ISO Date string (e.g., 2025-06-01T12:30:00)
  statut: StatutCandidature;
  offre: Offre;
  studentEmail: string; // Can be changed to studentId when you link the student entity
}
