import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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


@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}/evaluations/get_all_evaluations`);
  }

  /** Supprime une évaluation par ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evaluations/delete_evaluation/${id}`);
  }

  //modification
  update(id: number, evaluation: Evaluation): Observable<any> {
    return this.http.put(`${this.baseUrl}/evaluations/update_evaluation/${id}`, evaluation);
  }

  /* addEvaluationToProjet(projetId: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.baseUrl}/evaluations/add_evaluation/${projetId}`, evaluation);
  }*/

  addEvaluationToProjet(projetId: number,sprintId:number, evaluation: Evaluation) {
    return this.http.post(`${this.baseUrl}/evaluations/add_evaluation/${projetId}/${sprintId}`, evaluation);
  }


  // liste deroulante:

  getSprintsByProjetId(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sprints/projet/${projetId}`);
  }


  // addEvaluationToProjet(projetId: number, evaluation: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/add_evaluation/${projetId}`, evaluation);
  // }

//   addEvaluationToProjet(projetId: number, evaluationData: {
//   titre: string;
//   description: string;
//   dateEvaluation: string;
//   coef: number;
//   sprintId?: number | null;
// }): Observable<Evaluation> {
//   return this.http.post<Evaluation>(
//     `${this.baseUrl}/add_evaluation/${projetId}`,
//     evaluationData
//   );
// }


}
