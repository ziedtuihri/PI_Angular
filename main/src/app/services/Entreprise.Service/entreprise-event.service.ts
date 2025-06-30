// src/app/services/Entreprise.Service/event-entreprise.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event } from 'src/app/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventEntrepriseService {
  private baseUrl = `${environment.apiUrl}/evenements`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getByEntrepriseId(entrepriseId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}?entrepriseId=${entrepriseId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  create(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/entreprise/1`, event, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  update(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    const errorMsg = error.error?.message || 'Erreur inconnue!';
    return throwError(() => new Error(errorMsg));
  }

  acceptParticipation(participationId: number): Observable<void> {
    const url = `${environment.apiUrl}/participations/${participationId}/status`;
    const body = { status: 'VALIDE' }; // or whatever value the backend expects
    return this.http.patch<void>(url, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  rejectParticipation(participationId: number): Observable<void> {
    const url = `${environment.apiUrl}/participations/${participationId}/status`;
    const body = { status: 'REFUSE' }; // adjust the status value if needed
    return this.http.patch<void>(url, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }


}
