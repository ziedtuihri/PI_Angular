import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Encadrant } from 'src/app/models/encadrant.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseEncadrantService {
  // Hardcoded entrepriseId=1 for entreprise-specific endpoints
  private baseUrl = `${environment.apiUrl}/encadrants/1/encadrants`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Get all encadrants for entreprise with id=1
  getEncadrants(): Observable<Encadrant[]> {
    return this.http.get<Encadrant[]>(this.baseUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Create new encadrant under entreprise with id=1
  createEncadrant(encadrant: Omit<Encadrant, 'id'>): Observable<Encadrant> {
    return this.http.post<Encadrant>(this.baseUrl, encadrant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Update encadrant by id (not entreprise-specific)
  updateEncadrant(id: number, encadrant: Partial<Encadrant>): Observable<Encadrant> {
    return this.http.put<Encadrant>(`${environment.apiUrl}/encadrants/${id}`, encadrant, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Delete encadrant by id (not entreprise-specific)
  deleteEncadrant(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/encadrants/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Entreprise Encadrant Service Error:', error);
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
