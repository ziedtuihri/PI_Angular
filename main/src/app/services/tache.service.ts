// src/app/services/tache.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interface Definitions ---
// IMPORTANT: Adjust these interfaces to EXACTLY match your TacheCreationDTO and Tache entities on the backend.

// This should reflect the structure of your Spring Boot 'Tache' entity when returned from the backend.
export interface Tache {
  idTache?: number;
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string; // Should match TaskStatus enum names (e.g., "TODO", "IN_PROGRESS")
  storyPoints?: number;
  estimatedHours?: number;
  loggedHours?: number;
  assignedTo?: any; // Adjust if you have a specific DTO/entity for assignedTo
  sprint?: { // This mirrors how your backend returns the nested sprint in a Tache object
    idSprint: number;
    nom: string; // The sprint name, if your backend returns it
    // Add other sprint properties you expect to receive here (e.g., description, dateDebut)
  };
}

// This should reflect the structure of your Spring Boot 'TacheCreationDTO'
export interface CreateUpdateTacheDto {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string; // Should be the string representation of TaskStatus (e.g., "TODO")
  storyPoints?: number;
  estimatedHours?: number;
  sprintId: number; // The backend's TacheCreationDTO expects 'sprintId'
  // etudiantId?: number; // If you're assigning etudiants via their ID in the DTO
  // etudiantEmail?: string; // Or if you're assigning via email
}

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8081/api/taches';

  constructor(private http: HttpClient) {}

  createTache(tacheData: CreateUpdateTacheDto): Observable<Tache> {
    return this.http.post<Tache>(this.apiUrl, tacheData);
  }

  getTacheById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`);
  }

  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.apiUrl);
  }

  updateTache(id: number, tacheData: CreateUpdateTacheDto): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${id}`, tacheData);
  }

  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Matches GET /api/taches/by-sprint/{sprintId}
  getTasksBySprintId(sprintId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/by-sprint/${sprintId}`);
  }

  // Matches GET /api/taches/by-status/{status}
  // The backend uses @PathVariable, so we pass the status directly in the path.
  // The status string should match the exact name of your TaskStatus enum values (e.g., "TODO", "IN_PROGRESS").
  getTachesByStatus(status: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/by-status/${status}`);
  }

  // Add other methods if your backend supports them and your frontend needs them
  logTimeOnTask(taskId: number, hours: number): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${taskId}/log-time?hours=${hours}`, {});
  }

  updateTaskStatus(taskId: number, newStatus: string): Observable<Tache> {
    // Backend expects @RequestParam newStatus
    return this.http.put<Tache>(`${this.apiUrl}/${taskId}/status?newStatus=${newStatus}`, {});
  }
}