import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projet {
  idProjet?: number;
  nom: string;
  description?: string;
  // ... autres propriétés de votre entité Projet
}

export interface Sprint {
  idSprint?: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  description?: string;
  projet?: Projet; // <---- Propriété 'projet'
  etudiantsAffectes?: string[];
  taches?: any[];
  commentaires?: any[];
}

@Injectable({
  providedIn: 'root'
})

export class SprintService {
  private apiUrl = 'http://localhost:8081/api/sprints'; // Adaptez l'URL de votre API

  constructor(private http: HttpClient) {}

  createSprint(sprintData: any): Observable<Sprint> {
    return this.http.post<Sprint>(this.apiUrl, sprintData);
  }

  getSprintById(id: number): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/${id}`);
  }

  getAllSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(this.apiUrl);
  }

  updateSprint(id: number, sprintData: any): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, sprintData);
  }

  deleteSprint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  affecterEtudiantAuSprint(sprintId: number, nomEtudiant: string): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.apiUrl}/${sprintId}/etudiants`, nomEtudiant);
  }

  supprimerEtudiantDuSprint(sprintId: number, nomEtudiant: string): Observable<Sprint> {
    return this.http.delete<Sprint>(`${this.apiUrl}/${sprintId}/etudiants/${nomEtudiant}`);
  }

  getEtudiantsDuSprint(sprintId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${sprintId}/etudiants`);
  }
  searchSprints(nom: string): Observable<Sprint[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<Sprint[]>(`${this.apiUrl}/search`, { params });
  }
 
}