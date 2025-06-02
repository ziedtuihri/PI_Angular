import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";

export interface Candidature {
  id: number;
  dateCandidature: string;
  statut: string;
  offre: {
    id: number;
    titre: string;
  };
  studentEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private baseUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient) {}

  getCandidaturesByEntreprise(entrepriseId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.baseUrl}/entreprise/${entrepriseId}`);
  }

  updateCandidatureStatus(id: number, statut: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/status?statut=${statut}`, null);
  }

  applyCandidature(offreId: number, studentEmail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply?offreId=${offreId}&studentEmail=${studentEmail}`, null);
  }

  getCandidaturesByOffre(offreId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.baseUrl}/offre/${offreId}`);
  }

  deleteCandidature(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getCandidatureCountByOffre(offreId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/offre/${offreId}/count`);
  }

  getAcceptedCandidatureCountByOffre(offreId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/offre/${offreId}/count/accepted`);
  }

  getAppliedOffersByStudent(studentEmail: string): Observable<{ id: number; titre: string }[]> {
    // Adjust endpoint if needed, assuming backend supports filtering by student email
    return this.http.get<{ id: number; titre: string }[]>(`${this.baseUrl}/student-applied-offers?studentEmail=${studentEmail}`);
  }

}
