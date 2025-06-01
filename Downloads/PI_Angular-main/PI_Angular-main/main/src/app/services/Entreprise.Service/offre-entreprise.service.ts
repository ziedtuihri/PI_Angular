// src/app/services/Entreprise.Service/offre-entreprise.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { Offre } from 'src/app/models/offre.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffreEntrepriseService {
  private baseUrl = `${environment.apiUrl}/offres`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getByEntrepriseId(entrepriseId: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}?entrepriseId=${entrepriseId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

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

  update(id: number, offre: Partial<Offre>): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/${id}`, offre, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

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
