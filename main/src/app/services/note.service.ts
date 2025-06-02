import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
=======
import {Evaluation} from "./evaluation.service"; // Assuming this import is correct and needed
>>>>>>> de01570 (modif mariem+mahdi)

export interface Note {
  idNote?: number;
  valeur: number;
  evaluationId: number;
  userId: number;
<<<<<<< HEAD
  tacheId: number;
=======
  tacheId?: number; // Optional based on context
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
>>>>>>> de01570 (modif mariem+mahdi)
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
<<<<<<< HEAD
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // 👇 Récupérer la liste des utilisateurs ayant un rôle spécifique
  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/role`);
  }
}
=======
  private apiUrl = 'http://localhost:8081/api'; // Adapt to your backend URL

  constructor(private http: HttpClient) {}

  // ✅ Retrieve the list of users with a specific role
  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/role`);
  }

  // Assign a note
  affecterNote(note: any, options: any = {}) {
    return this.http.post(`${this.apiUrl}/notes/affecter`, note, options);
  }

  // ✅ Average for a project
  getMoyenneProjet(projetId: number, userId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/notes/moyenne/projet?projetId=${projetId}&userId=${userId}`
    );
  }

  // ✅ General average for a user
  getMoyenneGeneraleUtilisateur(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notes/moyenne/utilisateur/${userId}`);
  }

  // ✅ General average for all users
  getMoyenneGeneraleTous(): Observable<{ [user: string]: number }> {
    return this.http.get<{ [user: string]: number }>(`${this.apiUrl}/notes/moyenne/tous`);
  }

  // ✅ Retrieve all existing notes (to avoid duplicates)
  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/get`);
  }

  // Display notes
  getNoteDisplay() {
    return this.http.get<{
      userId: number;
      userName: string;
      sprintId: number;
      sprintNom: string;
      valeur: number;
      projetId: number; // Added as per NoteDisplayDto
      projetNom: string; // Added as per NoteDisplayDto
    }[]>(`${this.apiUrl}/notes/display`);
  }
}
>>>>>>> de01570 (modif mariem+mahdi)
