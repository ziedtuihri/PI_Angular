// src/app/services/Admin-Service/encadrant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Encadrant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite: string;
  entreprise?: { id: number; nom?: string };
}

@Injectable({
  providedIn: 'root'
})
export class EncadrantService {
  private baseUrl = `${environment.apiUrl}/encadrants`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /** GET all encadrants */
  getAll(): Observable<Encadrant[]> {
    return this.http.get<Encadrant[]>(this.baseUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** GET encadrant by ID */
  getById(id: number): Observable<Encadrant> {
    return this.http.get<Encadrant>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** POST create generic encadrant (without entreprise) */
  create(encadrant: Omit<Encadrant, 'id'>): Observable<Encadrant> {
    return this.http.post<Encadrant>(this.baseUrl, encadrant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** PUT update encadrant */
  update(id: number, encadrant: Partial<Encadrant>): Observable<Encadrant> {
    return this.http.put<Encadrant>(`${this.baseUrl}/${id}`, encadrant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** DELETE encadrant */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** GET encadrants for a specific entreprise */
  getByEntreprise(entrepriseId: number): Observable<Encadrant[]> {
    return this.http.get<Encadrant[]>(
      `${this.baseUrl}/${entrepriseId}/encadrants`,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** POST create encadrant for a specific entreprise */
  createForEntreprise(entrepriseId: number, encadrant: Omit<Encadrant, 'id'>): Observable<Encadrant> {
    return this.http.post<Encadrant>(
      `${this.baseUrl}/${entrepriseId}/encadrants`,
      encadrant,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  /** Centralized error handler */
  private handleError(error: any) {
    console.error('An error occurred:', error);
    const message = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
    return throwError(() => new Error(message));
  }
}
