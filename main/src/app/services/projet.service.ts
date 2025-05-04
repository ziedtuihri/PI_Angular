import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projet {
  idProjet?: number;
  nom: string;
  description: string;
  filePath?: string;
  dateDebut: string;
  dateFinPrevue: string;
  dateFinReelle?: string;
  statut: string;
  listeEtudiants?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private baseUrl = 'http://localhost:8081/pi/api/projets'; // Vérifiez cette URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.baseUrl);
  }

  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.baseUrl}/${id}`);
  }

  create(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>(this.baseUrl, projet);
  }

  update(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.baseUrl}/${id}`, projet);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  uploadFile(idProjet: number, file: File): Observable<{ message?: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message?: string; error?: string }>(`${this.baseUrl}/${idProjet}/upload`, formData);
  }

  downloadFile(idProjet: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/${idProjet}/download`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  ajouterEtudiantAuProjet(projetId: number, nomEtudiant: string): Observable<Projet> {
    return this.http.post<Projet>(`${this.baseUrl}/${projetId}/etudiants`, { nomEtudiant: nomEtudiant }); // Suggestion: Envoyer un objet JSON
  }

  supprimerEtudiantDuProjet(projetId: number, nomEtudiant: string): Observable<Projet> {
    const params = { nomEtudiant: nomEtudiant };
    return this.http.delete<Projet>(`${this.baseUrl}/${projetId}/etudiants`, { params }); // Suggestion: Utiliser des paramètres de requête
  }
}