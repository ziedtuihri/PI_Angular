// src/app/services/offre.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Offre {
  id: number;
  titre: string;
  description: string;
  competences?: string;
  localisation?: string;
  dateDebut?: string;  // use ISO date string in frontend
  dateFin?: string;
  disponible?: boolean;
  entrepriseId: number;
}

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private baseUrl = `${environment.apiUrl}/offres`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all offres
  getAll(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.baseUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Get offre by ID
  getById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Create new offre with entrepriseId in the URL
  create(offre: Omit<Offre, 'id'>): Observable<Offre> {
    if (!offre.entrepriseId) {
      return throwError(() => new Error("entrepriseId is required to create an Offre"));
    }

    return this.http.post<Offre>(
      `${this.baseUrl}/entreprise/${offre.entrepriseId}`,
      offre,
      this.httpOptions
    ).pipe(catchError(this.handleError));
  }

  // Update existing offre
  update(id: number, offre: Partial<Offre>): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/${id}`, offre, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Delete offre
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Disable offre
  disable(id: number): Observable<Offre> {
    return this.http.post<Offre>(`${this.baseUrl}/${id}/disable`, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
