export interface Participation {
  id: number;
  dateParticipation: string;
  statut: string;
  evenement: {
    id: number;
    titre: string;
    description: string;
    date: string;
    lieu: string;
    entreprise?: {
      id: number;
      nom: string;
    };
  };
  studentEmail: string;
}
