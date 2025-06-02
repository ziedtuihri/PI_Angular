import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for a User, if still relevant for your application's types
export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string; // Email is often a key identifier
  role?: string;
}

// Corrected and clarified interface for Project (Projet)
export interface Projet {
  // Use 'id' for consistency if your backend also uses 'id' for the primary key.
  // If backend uses 'idProjet', then keep 'idProjet' but be aware of mapping.
  // Assuming 'id' is the primary key for simplicity and common practice.
  //id?: number; // Optional as it might not exist for new projects

  idProjet?: number;
  nom: string;
  description: string;
  filePath?: string; // Optional, might be null if no file uploaded
  dateDebut: string; // Often a string (ISO format) from date pickers
  dateFinPrevue: string;
  dateFinReelle?: string; // Optional, set once project is finished
  statut: string; // E.g., "EN_COURS", "TERMINE", "ANNULE"
  projectType: string; // E.g., 'RESEARCH_AND_DEVELOPMENT', 'SOFTWARE_DEVELOPMENT'

  // These fields should directly reflect the structure of the Project object from your backend
  // If your backend's Projet DTO/Entity has these fields, then this is correct.
  teacherEmail?: string;
  studentEmailsList?: string[]; // Maps directly to List<String> in Java backend
}


@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  // Base URL for your project API endpoints
  private baseUrl = 'http://localhost:8081/api/projets';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all projects from the backend.
   * @returns An Observable array of Projet objects.
   */
  getAllProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.baseUrl);
  }

  /**
   * Fetches a single project by its ID.
   * @param id The ID of the project to retrieve.
   * @returns An Observable of the Projet object.
   */
  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.baseUrl}/${id}`);
  }

  /**
   * Creates a new project.
   * @param projet The Projet object to create.
   * @returns An Observable of the created Projet object (often with generated ID).
   */
  create(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.baseUrl, projet);
  }

  /**
   * Updates an existing project.
   * @param id The ID of the project to update.
   * @param projet The updated Projet object.
   * @returns An Observable of the updated Projet object.
   */
  update(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.baseUrl}/${id}`, projet);
  }

  /**
   * Deletes a project by its ID.
   * @param id The ID of the project to delete.
   * @returns An Observable that completes when the deletion is successful.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Uploads a file associated with a project.
   * @param idProjet The ID of the project.
   * @param file The File object to upload.
   * @returns An Observable indicating success or failure.
   */
  uploadFile(idProjet: number, file: File): Observable<{ message?: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message?: string; error?: string }>(`${this.baseUrl}/${idProjet}/upload`, formData);
  }

  /**
   * Downloads a file associated with a project.
   * @param idProjet The ID of the project.
   * @returns An Observable of type Blob, representing the file data.
   */
  downloadFile(idProjet: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${idProjet}/download`, {
      responseType: 'blob', // Crucial for handling file downloads
    });
  }



  /**
   * Assigns a teacher to a project using their email.
   * @param projetId The ID of the project.
   * @param email The email of the teacher to assign.
   * @returns An Observable of the updated Projet object.
   */
  assignTeacherEmailToProjet(projetId: number, email: string): Observable<Projet> {
    // Backend expects a JSON body like { "email": "..." }
    return this.http.put<Projet>(`${this.baseUrl}/${projetId}/assign-teacher-email`, { email });
  }

  /**
   * Sets the complete list of student emails for a project.
   * This typically replaces any existing list.
   * @param projetId The ID of the project.
   * @param emails An array of student emails to set.
   * @returns An Observable of the updated Projet object.
   */
  setStudentEmailsToProjet(projetId: number, emails: string[]): Observable<Projet> {
    // Backend expects a JSON array body like [ "email1", "email2" ]
    return this.http.post<Projet>(`${this.baseUrl}/${projetId}/set-student-emails`, emails);
  }

  /**
   * Adds a single student email to a project's student list.
   * @param projetId The ID of the project.
   * @param email The email of the student to add.
   * @returns An Observable of the updated Projet object.
   */
  addStudentEmail(projetId: number, email: string): Observable<Projet> {
    // Backend expects a JSON body like { "email": "..." }
    return this.http.post<Projet>(`${this.baseUrl}/${projetId}/add-student-email`, { email });
  }

  /**
   * Removes a single student email from a project's student list.
   * @param projetId The ID of the project.
   * @param email The email of the student to remove.
   * @returns An Observable of the updated Projet object.
   */
  removeStudentEmail(projetId: number, email: string): Observable<Projet> {
    // For DELETE requests with a body, the body must be passed in the options object.
    return this.http.request<Projet>('DELETE', `${this.baseUrl}/${projetId}/remove-student-email`, { body: { email } });
  }

  /**
   * Fetches the list of student emails associated with a project.
   * This is the method you'll likely use in your SprintFormComponent
   * to populate the studentsInSelectedProject list.
   * @param projetId The ID of the project.
   * @returns An Observable array of strings, where each string is a student's email.
   */
  getStudentEmails(projetId: number): Observable<string[]> {
    // Backend returns an array of strings (emails)
    return this.http.get<string[]>(`${this.baseUrl}/${projetId}/student-emails`);
  }

  // These methods seem to be remnants of an older ID-based assignment system.
  // Given your current backend endpoints focus on email-based assignments,
  // these might no longer be needed. Review your UI and backend if they're still used.

  // If your backend still has an endpoint like /projets/{id}/affecter-encadrant/{encadrantId}, keep it.
  // Otherwise, it's safe to remove.
  affecterEncadrantAuProjet(projetId: number, encadrantId: number): Observable<Projet> {
    console.warn("`affecterEncadrantAuProjet` might be a legacy method. Consider using `assignTeacherEmailToProjet` instead.");
    return this.http.put<Projet>(`${this.baseUrl}/${projetId}/affecter-encadrant/${encadrantId}`, {});
  }

  // If your backend still has an endpoint like /projets/{id}/affecter-etudiants, keep it.
  // Otherwise, it's safe to remove.
  affecterEtudiantsAuProjet(projetId: number, etudiantsIds: number[]): Observable<Projet> {
    console.warn("`affecterEtudiantsAuProjet` might be a legacy method. Consider using `setStudentEmailsToProjet` or `addStudentEmail` instead.");
    return this.http.put<Projet>(`${this.baseUrl}/${projetId}/affecter-etudiants`, etudiantsIds);
  }
}