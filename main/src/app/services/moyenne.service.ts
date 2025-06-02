import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- Interfaces (Ideally, these would be in separate files like src/app/shared/models/*.ts) ---

export interface ProjetDto {
  id: number;
  nom: string;
}

export interface User {
  // This interface should match the full User entity from your backend if you ever fetch it directly
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Add other user fields if needed
}

export interface UserNameDto {
  id: number;
  firstName: string;
  lastName: string;
}

// --- Service Implementation ---

@Injectable({
  providedIn: 'root'
})
export class MoyenneService {

  // Use a constant for the base API URL for better maintainability
  private readonly API_URL = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of projects as DTOs from the backend.
   * Corresponds to backend's /api/projets/dto endpoint.
   * @returns An Observable of an array of ProjetDto.
   */
  getProjetsDto(): Observable<ProjetDto[]> {
    return this.http.get<ProjetDto[]>(`${this.API_URL}/projets/dto`); // Changed to /projets/dto as per backend structure
  }

  /**
   * Fetches a list of all users as UserNameDto.
   * Corresponds to backend's /api/users/all endpoint.
   * @returns An Observable of an array of UserNameDto.
   */
  getUsers(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.API_URL}/users/all`);
  }

  /**
   * Fetches a list of users filtered by role as UserNameDto.
   * Corresponds to backend's /api/users/role endpoint.
   * @returns An Observable of an array of UserNameDto.
   */
  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.API_URL}/users/role`);
  }

  /**
   * Fetches the average score for a specific user within a given project.
   * Corresponds to backend's /api/notes/moyenne/projet endpoint.
   * @param projetId The ID of the project.
   * @param userId The ID of the user.
   * @returns An Observable of a number representing the average score.
   */
  getMoyenneProjet(projetId: number, userId: number): Observable<number> {
    // Use HttpParams for cleaner query parameter handling
    let params = new HttpParams()
      .set('projetId', projetId.toString())
      .set('userId', userId.toString());

    return this.http.get<number>(`${this.API_URL}/notes/moyenne/projet`, { params: params });
  }

  // You could add other methods here, e.g., for general averages or assigning notes
  // getMoyenneGeneraleUtilisateur(userId: number): Observable<number> {
  //   return this.http.get<number>(`${this.API_URL}/notes/moyenne/utilisateur/${userId}`);
  // }

  // assignNote(noteData: any): Observable<any> {
  //   return this.http.post(`${this.API_URL}/notes/affecter`, noteData);
  // }
}