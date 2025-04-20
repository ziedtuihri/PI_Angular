import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evaluation {
  idEvaluation?: number;
  commentaire: string;
  note: number;
  dateEvaluation: string;
  // Tu peux ajouter projet ou sprint ici si besoin
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8082/api/evaluations/all';

  constructor(private http: HttpClient) {}

  // getAll(): Observable<Evaluation[]> {
  //   return this.http.get<Evaluation[]>(`${this.baseUrl}/all`);
  // }

  getAll(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}/all`);
  }
  

  // Autres méthodes si besoin (add, delete, etc.)
}
