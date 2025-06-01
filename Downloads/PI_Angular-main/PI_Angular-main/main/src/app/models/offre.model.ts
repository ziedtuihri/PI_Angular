export interface Offre {
  end: Date | string | number | number[] | any;
  start: Date | string | number | number[] | any;
  id: number;
  titre: string;
  description: string;
  competences?: string;
  localisation?: string;
  dateDebut?: string;     // ISO 8601 format (e.g., "2025-06-01")
  dateFin?: string;
  disponible?: boolean;
  entrepriseId: number;
}
