import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Evaluation} from "./evaluation.service";

export interface Note {
  idNote?: number;
  valeur: number;
  evaluationId: number;
  userId: number;
  tacheId?: number; // Optionnel selon contexte
  sprintId: number;
}

export interface NoteDisplayDto {
  userId: number;
  userName: string;
  sprintId: number;
  sprintNom: string;
  valeur: number;
  projetId: number;
  projetNom: string;
}


export interface UserNameDto {
  id: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer la liste des utilisateurs ayant un rôle spécifique
  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/role`);
  }


  affecterNote(note: any, options: any = {}) {
    return this.http.post(`${this.apiUrl}/notes/affecter`, note, options);
  }


  // ✅ Moyenne pour un projet
  getMoyenneProjet(projetId: number, userId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/notes/moyenne/projet?projetId=${projetId}&userId=${userId}`
    );
  }


  // ✅ Moyenne générale d’un utilisateur
  getMoyenneGeneraleUtilisateur(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notes/moyenne/utilisateur/${userId}`);
  }

  // ✅ Moyenne générale pour tous les utilisateurs
  getMoyenneGeneraleTous(): Observable<{ [user: string]: number }> {
    return this.http.get<{ [user: string]: number }>(`${this.apiUrl}/notes/moyenne/tous`);
  }

  // ✅ Récupérer toutes les notes existantes (pour éviter les doublons)
  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/get`);
  }

 //affichage des notes
  getNoteDisplay() {
    return this.http.get<{
      userId: number;
      userName: string;
      sprintId: number;
      sprintNom: string;
      valeur: number;
    }[]>(`${this.apiUrl}/notes/display`);
  }






}
