import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8081/api/taches'; // Adaptez l'URL de votre API pour les tâches

  constructor(private http: HttpClient) {}

  createTache(tacheData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tacheData);
  }

  getTacheById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAllTaches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateTache(id: number, tacheData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tacheData);
  }

  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour récupérer les tâches associées à un sprint spécifique (si vous avez cet endpoint)
  getTachesBySprintId(sprintId: number): Observable<any[]> {
    const url = `${this.apiUrl}/sprint/${sprintId}`; // Adaptez l'URL de votre API
    return this.http.get<any[]>(url);
  }
}