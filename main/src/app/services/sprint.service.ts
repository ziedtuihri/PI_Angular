// src/app/services/sprint.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

// --- Interface Definitions ---

export interface Projet {
  idProjet?: number;
  nom?: string;
  description?: string;
  dateDebut?: string;
  dateFinPrevue?: string;
}

// Suggested Task Interface for better type safety
export interface Tache {
  id?: number;
  nom: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  statut: string; // e.g., 'TODO', 'IN_PROGRESS', 'DONE'
  storyPoints?: number;
  estimatedHours?: number;
  loggedHours?: number;
  etudiantsAffectes?: string[];
  // Add any other relevant task properties
}

export interface Sprint {
  idSprint?: number;
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  projet?: Projet;
  isUrgent?: boolean;
  velocity?: number;
  taches?: Tache[]; // Changed to Tache[] for type safety
  etudiantsAffectes?: string[]; // The list of emails of affected students
}

// Interface for creating a sprint (includes affected students)
export interface CreateSprintDto {
  nom: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  projetId: number;
  etudiantsAffectes?: string[]; // Included for initial send
}

// --- End Interface Definitions ---

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  // Ensure this URL matches your backend's base URL and port.
  // For example, if your backend is Spring Boot on port 8080, it might be: 'http://localhost:8080/api/sprints'
  private apiUrl = 'http://localhost:8081/api/sprints';

  constructor(private http: HttpClient) {} // Type annotation for HttpClient

  /**
   * Private helper to synchronize student assignments after a sprint operation.
   * This method is only necessary if the main create/update endpoints
   * DO NOT accept 'etudiantsAffectes' directly in the DTO.
   * (Currently, the main create/update methods assume the backend handles 'etudiantsAffectes' directly).
   */
  private _syncStudentAssignments(sprintId: number, newStudentEmails: string[]): Observable<any> {
    return this.getEtudiantsAffectesAuSprint(sprintId).pipe(
      switchMap((currentEmails: string[]) => {
        const toAdd = newStudentEmails.filter(email => !currentEmails.includes(email));
        const toRemove = currentEmails.filter(email => !newStudentEmails.includes(email));

        const assignmentObservables: Observable<any>[] = [];

        toAdd.forEach(email => {
          assignmentObservables.push(
            this.affecterEtudiantAuSprint(sprintId, email).pipe(
              tap(() => console.log(`Student ${email} assigned to sprint ${sprintId}`)),
              catchError(err => {
                console.error(`Error assigning ${email}:`, err);
                return of(null); // Return null to allow forkJoin to complete even if one assignment fails
              })
            )
          );
        });

        toRemove.forEach(email => {
          assignmentObservables.push(
            this.supprimerEtudiantDuSprint(sprintId, email).pipe(
              tap(() => console.log(`Student ${email} removed from sprint ${sprintId}`)),
              catchError(err => {
                console.error(`Error removing ${email}:`, err);
                return of(null); // Return null to allow forkJoin to complete even if one unassignment fails
              })
            )
          );
        });

        if (assignmentObservables.length === 0) {
          return of(null); // No assignments to sync
        }

        return forkJoin(assignmentObservables).pipe(
          tap(() => console.log('Student assignments/unassignments completed for sprint:', sprintId)),
          catchError(err => {
            console.error('One or more errors during student assignments/unassignments:', err);
            return throwError(() => new Error('Partial student assignment failure'));
          })
        );
      })
    );
  }

  /**
   * Creates a new sprint.
   *
   * ASSUMPTION: This assumes your backend's POST /api/sprints endpoint
   * ACCEPTS 'etudiantsAffectes' directly in the CreateSprintDto.
   */
  createSprint(sprintData: CreateSprintDto): Observable<Sprint> {
    // Send the whole sprintData object, including etudiantsAffectes, to the backend.
    return this.http.post<Sprint>(this.apiUrl, sprintData).pipe(
      catchError(error => {
        console.error('Error in createSprint service call:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Updates an existing sprint.
   *
   * ASSUMPTION: This assumes your backend's PUT /api/sprints/{id} endpoint
   * ACCEPTS 'etudiantsAffectes' directly in the Sprint DTO.
   */
  updateSprint(id: number, sprintData: Sprint): Observable<Sprint> {
    // Send the whole sprintData object, including etudiantsAffectes, to the backend.
    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, sprintData).pipe(
      catchError(error => {
        console.error('Error in updateSprint service call:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Retrieves a sprint by its ID.
   * @param id The ID of the sprint.
   * @returns An Observable of a single Sprint object.
   */
  getSprintById(id: number): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves all sprints.
   * @returns An Observable of an array of Sprint objects.
   */
  getAllSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.apiUrl);
  }

  /**
   * Deletes a sprint by its ID.
   * @param id The ID of the sprint to delete.
   * @returns An Observable indicating completion of the delete operation.
   */
  deleteSprint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Searches for sprints by name.
   * @param term The search term for the sprint name.
   * @returns An Observable of an array of matching Sprint objects.
   */
  searchSprints(term: string): Observable<Sprint[]> {
    const params = new HttpParams().set('nom', term);
    return this.http.get<Sprint[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Calculates the velocity for a specific sprint.
   * @param sprintId The ID of the sprint.
   * @returns An Observable of the calculated velocity (number).
   */
  calculateSprintVelocity(sprintId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${sprintId}/velocity`);
  }

  /**
   * Retrieves a sprint along with its associated tasks.
   * @param sprintId The ID of the sprint.
   * @returns An Observable of a Sprint object, which should include a 'taches' property.
   */
  getSprintWithTasks(sprintId: number): Observable<Sprint> {
    const url = `${this.apiUrl}/${sprintId}/withTasks`;
    return this.http.get<Sprint>(url);
  }

  /**
   * Creates a task for a given sprint.
   * @param sprintId The ID of the sprint to add the task to.
   * @param taskData The data for the task to create.
   * @returns An Observable of the created task object.
   */
  createTaskForSprint(sprintId: number, taskData: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/${sprintId}/taches`, taskData);
  }

  /**
   * Affects an etudiant to a sprint using their email.
   * @param sprintId The ID of the sprint.
   * @param etudiantEmail The email of the student to affect.
   * @returns An Observable of the response from the backend (usually the updated Sprint).
   */
  affecterEtudiantAuSprint(sprintId: number, etudiantEmail: string): Observable<Sprint> {
    // Assuming backend expects a raw string in the request body.
    // If backend expects { "email": "..." }, change the body to: { email: etudiantEmail }
    return this.http.post<Sprint>(
      `${this.apiUrl}/${sprintId}/etudiants`,
      etudiantEmail,
      { headers: { 'Content-Type': 'text/plain' } } // Indicate plain text if sending raw string
    );
  }

  /**
   * Removes an etudiant from a sprint.
   * @param sprintId The ID of the sprint.
   * @param etudiantEmail The email of the student to remove.
   * @returns An Observable of the response from the backend (usually the updated Sprint).
   */
  supprimerEtudiantDuSprint(sprintId: number, etudiantEmail: string): Observable<Sprint> {
    const encodedEmail = encodeURIComponent(etudiantEmail);
    return this.http.delete<Sprint>(`${this.apiUrl}/${sprintId}/etudiants/${encodedEmail}`);
  }

  /**
   * Retrieves the list of emails of students affected to a sprint.
   * @param sprintId The ID of the sprint.
   * @returns An Observable of an array of student emails (strings).
   */
  getEtudiantsAffectesAuSprint(sprintId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${sprintId}/etudiants`);
  }

  /**
   * Retrieves historical velocity data for completed sprints.
   * @returns An Observable of an array of objects suitable for a velocity chart.
   */
  getVelocityHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/velocity-history`);
  }

  /**
   * Retrieves general calendar events from the backend.
   * @returns An Observable of an array of calendar event objects.
   */
  getCalendarEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/calendar-events`);
  }

  /**
   * Checks and potentially completes a sprint based on its task completion status.
   * @param sprintId The ID of the sprint to check.
   * @returns An Observable indicating completion.
   */
  checkAndCompleteSprint(sprintId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${sprintId}/check-completion`, {});
  }

  /**
   * Checks and potentially completes a project based on its sprint completion status.
   * @param projectId The ID of the project to check.
   * @returns An Observable indicating completion.
   */
  checkAndCompleteProject(projectId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/project/${projectId}/check-completion`, {});
  }
}