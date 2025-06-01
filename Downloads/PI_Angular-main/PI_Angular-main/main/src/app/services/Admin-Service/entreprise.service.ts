// src/app/services/entreprise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface for better type safety (create this in src/app/models/entreprise.model.ts)
interface Entreprise {
  id: number;
  nom: string;
  email: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private baseUrl = `${environment.apiUrl}/entreprises`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all entreprises
  getAll(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(this.baseUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get single entreprise by ID
  getById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create new entreprise
  create(entreprise: Omit<Entreprise, 'id'>): Observable<Entreprise> {
    return this.http.post<Entreprise>(this.baseUrl, entreprise, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update existing entreprise
  update(id: number, entreprise: Partial<Entreprise>): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.baseUrl}/${id}`, entreprise, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete entreprise
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Validate entreprise (admin action)
  validate(id: number): Observable<Entreprise> {
    return this.http.put<Entreprise>(
      `${this.baseUrl}/${id}/validate`,
      {}, // Empty body
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Refuse entreprise (admin action)
  refuse(id: number): Observable<Entreprise> {
    return this.http.put<Entreprise>(
      `${this.baseUrl}/${id}/refuse`,
      {}, // Empty body
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get entreprises by status
  getByStatus(status: string): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(
      `${this.baseUrl}?status=${status}`,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
