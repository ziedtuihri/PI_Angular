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
  taches?: any[]; // Consider a specific Task interface if you have one.
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

export interface Etudiant {
  idEtudiant?: number;
  nom: string;
  prenom: string;
  email?: string;
}

// --- End Interface Definitions ---

@Injectable({
  providedIn: 'root'
})

export class SprintService {
  // Directly define your API base URL here for the sprint service.
  // Make sure this matches your backend's sprint API base URL.
  private apiUrl = 'http://localhost:8081/api/sprints';

  constructor(private http: HttpClient) {}

  /**
   * Private helper to manage student assignments/unassignments after a sprint operation.
   * This method compares current students with the new list to determine what actions to take.
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
            // Optionally, re-throw a more specific error or handle it here
            return throwError(() => new Error('Partial student assignment failure'));
          })
        );
      })
    );
  }

  /**
   * Creates a new sprint and manages student assignments if necessary.
   *
   * IMPORTANT: This assumes your backend's POST /sprints endpoint
   * DOES NOT expect 'etudiantsAffectes' directly in the DTO,
   * but rather expects them via separate POST /sprints/{id}/etudiants calls.
   * If your backend expects 'etudiantsAffectes' in the main DTO,
   * remove 'delete createPayload.etudiantsAffectes;' and the 'switchMap' part.
   */
  createSprint(sprintData: CreateSprintDto): Observable<Sprint> {
    const studentsToAssign = sprintData.etudiantsAffectes || [];
    const createPayload = { ...sprintData };
    delete createPayload.etudiantsAffectes; // Remove this if your backend handles it in the main DTO

    return this.http.post<Sprint>(this.apiUrl, createPayload).pipe(
      switchMap((createdSprint: Sprint) => {
        if (createdSprint.idSprint && studentsToAssign.length > 0) {
          return this._syncStudentAssignments(createdSprint.idSprint, studentsToAssign).pipe(
            map(() => createdSprint) // Return the created sprint after assignment sync
          );
        }
        return of(createdSprint); // Return the created sprint directly if no students to assign
      }),
      catchError(error => {
        console.error('Error in createSprint service call:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Updates an existing sprint and manages student assignments.
   *
   * IMPORTANT: This assumes your backend's PUT /sprints/{id} endpoint
   * DOES NOT expect 'etudiantsAffectes' directly in the DTO,
   * but rather expects them via separate POST/DELETE /sprints/{id}/etudiants calls.
   * If your backend expects 'etudiantsAffectes' in the main DTO,
   * remove 'delete updatePayload.etudiantsAffectes;' and the 'switchMap' part.
   */
  updateSprint(id: number, sprintData: Sprint): Observable<Sprint> {
    const studentsToAssign = sprintData.etudiantsAffectes || [];
    const updatePayload = { ...sprintData };
    delete updatePayload.etudiantsAffectes; // Remove this if your backend handles it in the main DTO

    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, updatePayload).pipe(
      switchMap((updatedSprint: Sprint) => {
        return this._syncStudentAssignments(id, studentsToAssign).pipe(
          map(() => updatedSprint) // Return the updated sprint after assignment sync
        );
      }),
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
  createTaskForSprint(sprintId: number, taskData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${sprintId}/taches`, taskData);
  }

  /**
   * Affects an etudiant to a sprint using their email.
   * @param sprintId The ID of the sprint.
   * @param etudiantEmail The email of the student to affect.
   * @returns An Observable of the response from the backend.
   */
  affecterEtudiantAuSprint(sprintId: number, etudiantEmail: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${sprintId}/etudiants`,
      JSON.stringify(etudiantEmail), // Backend might expect a simple string in the body
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  /**
   * Removes an etudiant from a sprint.
   * @param sprintId The ID of the sprint.
   * @param etudiantEmail The email of the student to remove.
   * @returns An Observable of the response from the backend.
   */
  supprimerEtudiantDuSprint(sprintId: number, etudiantEmail: string): Observable<any> {
    const encodedEmail = encodeURIComponent(etudiantEmail);
    return this.http.delete<any>(`${this.apiUrl}/${sprintId}/etudiants/${encodedEmail}`);
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