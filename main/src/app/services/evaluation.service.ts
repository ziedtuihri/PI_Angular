import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface de l'évaluation
export interface Evaluation {
  idEvaluation?: number;
  titre: string;
  description: string;
  dateEvaluation: string;
  coef: number;
  projet?: {
    idProjet: number;
    nom: string;
  };
  sprint?: {
    idSprint: number;
    nom: string;
  };
}

// Interface de sprint utilisée pour les listes déroulantes
export interface Sprint {
  idSprint: number;
  nom: string;
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les évaluations.
   * Utilise un fallback [] si null est retourné pour éviter les erreurs comme `.some` sur null.
   */
  getAll(): Observable<Evaluation[]> {
    return this.http
      .get<Evaluation[]>(`${this.baseUrl}/evaluations/get_all_evaluations`)
      .pipe(map(evals => evals ?? []));
  }

  /** Supprime une évaluation par ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evaluations/delete_evaluation/${id}`);
  }

  /** Met à jour une évaluation */
  update(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.baseUrl}/evaluations/update_evaluation/${id}`, evaluation);
  }

  /**
   * Ajoute une évaluation à un projet et un sprint.
   * @param projetId ID du projet
   * @param sprintId ID du sprint
   * @param evaluation Données de l'évaluation
   */
  addEvaluationToProjet(projetId: number, sprintId: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(
      `${this.baseUrl}/evaluations/add_evaluation/${projetId}/${sprintId}`,
      evaluation
    );
  }

  /**
   * Récupère tous les sprints associés à un projet
   * @param projetId ID du projet
   */
  getSprintsByProjetId(projetId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.baseUrl}/sprints/projet/${projetId}`);
  }
}
