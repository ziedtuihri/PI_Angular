import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
  idNote?: number;
  valeur: number;
  evaluationId: number;
  userId: number;
  tacheId: number;
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

  // 👇 Récupérer la liste des utilisateurs ayant un rôle spécifique
  getUsersByRole(): Observable<UserNameDto[]> {
    return this.http.get<UserNameDto[]>(`${this.apiUrl}/users/role`);
  }
}
