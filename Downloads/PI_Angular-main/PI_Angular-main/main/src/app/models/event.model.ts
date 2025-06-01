// src/app/models/event.model.ts

import { Entreprise } from './entreprise.model';

export interface Event {
  id?: number;
  titre: string;
  description: string;
  date: string; // ISO string (e.g., '2024-06-01'), use string to handle Angular form binding
  lieu: string;
  entreprise?: Entreprise;
}
