// src/app/services/convention.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface Convention {
  id: number;
  titre: string;
  description: string;
  entrepriseId: number;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class ConventionService {
  private baseUrl = `${environment.apiUrl}/conventions`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all conventions
  getAll(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.baseUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get convention by ID
  getById(id: number): Observable<Convention> {
    return this.http.get<Convention>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create new convention
  create(convention: Omit<Convention, 'id'>): Observable<Convention> {
    return this.http.post<Convention>(this.baseUrl, convention, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update existing convention
  update(id: number, convention: Partial<Convention>): Observable<Convention> {
    return this.http.put<Convention>(`${this.baseUrl}/${id}`, convention, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete convention
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
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
