// src/app/services/tache.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interface Definitions ---

// Optional: Define a specific User/Etudiant interface for better type safety for assignedTo
export interface User {
  email: string; // Assuming email is the key identifier for a user/student
  // Add other user properties like id, firstName, lastName, etc. if your backend returns them
}

// This should reflect the structure of your Spring Boot 'Tache' entity when returned from the backend.
export interface Tache {
  idTache?: number;
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string; // Should match TaskStatus enum names (e.g., "TODO", "IN_PROGRESS", "DONE")
  storyPoints?: number;
  estimatedHours?: number;
  loggedHours?: number;
  assignedTo?: User; // Using the more specific User interface, if applicable
  sprint?: { // This mirrors how your backend returns the nested sprint in a Tache object
    idSprint: number;
    nom: string;
    description?: string;
    dateDebut?: string;
    dateFin?: string;
    // Add other sprint properties you expect to receive here (e.g., statut)
  };
  projet?: { // Tache also has a direct link to Projet now
    idProjet: number;
    nom: string;
    // Add other project properties you expect to receive here
  };
  etudiantsAffectes?: string[]; // List of emails of affected students
}

// This should reflect the structure of your Spring Boot 'TacheCreationDTO' or 'TacheUpdateDTO'
export interface CreateUpdateTacheDto {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string; // Should be the string representation of TaskStatus (e.g., "TODO")
  storyPoints?: number;
  estimatedHours?: number;
  sprintId?: number | null; // Allow null for tasks not initially assigned to a sprint
  etudiantsAffectes?: string[]; // For assigning students during creation/update
}

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  // Ensure this URL matches your backend's base URL and port for tasks.
  private apiUrl = 'http://localhost:8081/api/taches';

  constructor(private http: HttpClient) {}

  /**
   * Creates a new task.
   * @param tacheData The DTO containing task details.
   * @returns An Observable of the created Tache object.
   */
  createTache(tacheData: CreateUpdateTacheDto): Observable<Tache> {
    return this.http.post<Tache>(this.apiUrl, tacheData);
  }

  /**
   * Retrieves a task by its ID.
   * @param id The ID of the task.
   * @returns An Observable of the Tache object.
   */
  getTacheById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves all tasks.
   * @returns An Observable of an array of Tache objects.
   */
  getAllTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.apiUrl);
  }

  /**
   * Updates an existing task.
   * @param id The ID of the task to update.
   * @param tacheData The DTO containing updated task details.
   * @returns An Observable of the updated Tache object.
   */
  updateTache(id: number, tacheData: CreateUpdateTacheDto): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${id}`, tacheData);
  }

  /**
   * Deletes a task by its ID.
   * @param id The ID of the task to delete.
   * @returns An Observable that completes when the deletion is successful.
   */
  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Fetches tasks belonging to a specific sprint.
   * Matches GET /api/taches/by-sprint/{sprintId} on the backend.
   * @param sprintId The ID of the sprint.
   * @returns An Observable array of Tache objects.
   */
  getTasksBySprintId(sprintId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/by-sprint/${sprintId}`);
  }

  /**
   * Fetches tasks by their status.
   * Matches GET /api/taches/by-status/{status} on the backend.
   * The status string should match the exact name of your TaskStatus enum values (e.g., "TODO", "IN_PROGRESS").
   * @param status The status of the tasks to retrieve.
   * @returns An Observable array of Tache objects.
   */
  getTachesByStatus(status: string): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/by-status/${status}`);
  }

  /**
   * Logs time on a specific task.
   * Matches PUT /api/taches/{taskId}/log-time?hoursToLog={hours} on the backend.
   * @param taskId The ID of the task.
   * @param hours The number of hours to log.
   * @returns An Observable of the updated Tache object.
   */
  logTimeOnTask(taskId: number, hours: number): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${taskId}/log-time?hoursToLog=${hours}`, {});
  }

  /**
   * Updates the status of a specific task.
   * Matches PUT /api/taches/{taskId}/status?newStatus={newStatus} on the backend.
   * @param taskId The ID of the task.
   * @param newStatus The new status for the task (e.g., "DONE").
   * @returns An Observable of the updated Tache object.
   */
  updateTaskStatus(taskId: number, newStatus: string): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${taskId}/status?newStatus=${newStatus}`, {});
  }

  /**
   * Assigns a student to a task using their email.
   * Matches POST /api/taches/{id}/etudiants?email={email} on the backend.
   * @param tacheId The ID of the task.
   * @param etudiantEmail The email of the student to assign.
   * @returns An Observable of the updated Tache object.
   */
  affecterEtudiantToTache(tacheId: number, etudiantEmail: string): Observable<Tache> {
    // Backend expects @RequestParam email, so we use a query parameter.
    return this.http.post<Tache>(`${this.apiUrl}/${tacheId}/etudiants?email=${encodeURIComponent(etudiantEmail)}`, {});
  }

  /**
   * Removes a student from a task using their email.
   * Matches DELETE /api/taches/{id}/etudiants?email={email} on the backend.
   * @param tacheId The ID of the task.
   * @param etudiantEmail The email of the student to remove.
   * @returns An Observable of the updated Tache object.
   */
  supprimerEtudiantFromTache(tacheId: number, etudiantEmail: string): Observable<Tache> {
    // Backend expects @RequestParam email, so we use a query parameter.
    return this.http.delete<Tache>(`${this.apiUrl}/${tacheId}/etudiants?email=${encodeURIComponent(etudiantEmail)}`);
  }

  /**
   * Retrieves the list of student emails assigned to a task.
   * Matches GET /api/taches/{id}/etudiants on the backend.
   * @param tacheId The ID of the task.
   * @returns An Observable array of strings (student emails).
   */
  getEtudiantsAffectesToTache(tacheId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${tacheId}/etudiants`);
  }

  /**
   * Retrieves tasks assigned to a specific student email.
   * Matches GET /api/taches/by-student-email?studentEmail={studentEmail} on the backend.
   * @param studentEmail The email of the student.
   * @returns An Observable array of Tache objects.
   */
  getTachesByStudentEmail(studentEmail: string): Observable<Tache[]> {
    // Assuming backend takes email as a @RequestParam.
    return this.http.get<Tache[]>(`${this.apiUrl}/by-student-email?studentEmail=${encodeURIComponent(studentEmail)}`);
  }
}