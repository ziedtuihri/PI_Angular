import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Participation {
  id: number;
  dateParticipation: string;
  statut: string;
  evenement: {
    id: number;
    titre: string;
    description: string;
    date: string;
    lieu: string;
    entreprise?: {
      id: number;
      nom: string;
    };
  };
  studentEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private baseUrl = `${environment.apiUrl}/participations`;

  constructor(private http: HttpClient) {}

  applyToEvent(evenementId: number, studentEmail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply?evenementId=${evenementId}&studentEmail=${studentEmail}`, null);
  }

  getByEvenement(evenementId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/evenement/${evenementId}`);
  }

  getCountByEvenement(evenementId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/evenement/${evenementId}/count`);
  }

  getAcceptedCountByEvenement(evenementId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/evenement/${evenementId}/count/accepted`);
  }

  getByEventId(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/evenement/${eventId}`);
  }

  updateStatus(participationId: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${participationId}/status`, { status });
  }

  hasStudentApplied(eventId: number, studentEmail: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/participations/hasApplied`, {
      params: {
        evenementId: eventId.toString(),
        studentEmail
      }
    });
  }

  deleteParticipation(participationId: number, studentEmail: string) {
    return this.http.delete(`${this.baseUrl}/${participationId}`);
  }



}
