export interface Encadrant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite: string;  // competence / specialty
  entreprise?: { id: number; nom?: string }; // match your data structure
}
